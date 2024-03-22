// map-points2 api is organized by owners
// then it uses those owner to get all of their properties
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RowData = {
  sam_id: string;
  latitude: string;
  longitude: string;
  full_address: string;
  mailing_neighborhood: string;
  zip_code: string;
  parcel: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // we use raw here because prisma doesn't have DISTINCT ON
    const results: RowData[] = await prisma.$queryRaw`
      WITH OwnersWithViolations AS (
        SELECT
            property."OWNER"
        FROM
            sam
        JOIN
            property ON sam."PARCEL" = property."PID"
        JOIN
            parcel ON sam."PARCEL" = parcel."MAP_PAR_ID"
        JOIN
            bpv ON sam."SAM_ADDRESS_ID" = bpv."sam_id"
        WHERE
            CAST(property."year" AS integer) = 2023
        GROUP BY
            property."OWNER"
        HAVING
            COUNT(bpv."sam_id") > 5
      )
      SELECT
          bpv."sam_id",
          bpv."latitude",
          bpv."longitude",
          MAX(sam."FULL_ADDRESS") AS "FULL_ADDRESS", 
          MAX(sam."MAILING_NEIGHBORHOOD") AS "MAILING_NEIGHBORHOOD",
          MAX(sam."ZIP_CODE") AS "ZIP_CODE",
          MAX(sam."PARCEL") AS "PARCEL"
      FROM
          sam
      JOIN
          property ON sam."PARCEL" = property."PID"
      JOIN
          bpv ON sam."SAM_ADDRESS_ID" = bpv."sam_id"
      WHERE
          property."OWNER" IN (SELECT "OWNER" FROM OwnersWithViolations)
      group by
          bpv."latitude", bpv."longitude", bpv."sam_id";
    `
    // SQL to geoJson
    const geoJson = {
      type: "FeatureCollection",
      features: results.map((row: RowData) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [row.longitude, row.latitude],
        },
        properties: {
          SAM_ID: row.sam_id,
          FULL_ADDRESS: row.full_address,
          MAILING_NEIGHBORHOOD: row.mailing_neighborhood,
          ZIP_CODE: row.zip_code,
          parcel: row.parcel
        },
      })),
    };
    res.status(200).json(geoJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  } finally {
    await prisma.$disconnect();
  }
}