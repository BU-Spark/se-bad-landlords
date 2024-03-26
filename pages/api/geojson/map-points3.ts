// map-points3 api is similar to map-points2
// But it fetch more data

import { IAddress } from '../search';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
import prisma from "../../../prisma/prismaClient"


type RowData = {
    // below is columns from prisma.bpv
    sam_id: string;
    latitude: string;
    longitude: string;
    // below is IAddress (Remember SAM_ADDRESS_ID)
    // SAM_ADDRESS_ID: string  // same to sam_id
    FULL_ADDRESS         :String
    MAILING_NEIGHBORHOOD :String
    ZIP_CODE             :String
    X_COORD              :String
    Y_COORD              :String
    PARCEL               :String
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
            COUNT(bpv."sam_id") > 0
      )
      SELECT
            bpv."sam_id",
            bpv."latitude",
            bpv."longitude",
            MAX(sam."FULL_ADDRESS") AS "FULL_ADDRESS", 
            MAX(sam."MAILING_NEIGHBORHOOD") AS "MAILING_NEIGHBORHOOD",
            MAX(sam."ZIP_CODE") AS "ZIP_CODE",
            MAX(sam."X_COORD") AS "X_COORD",
            MAX(sam."Y_COORD") AS "Y_COORD",
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
                    addressDetails: {
                        SAM_ADDRESS_ID: row.sam_id,
                        FULL_ADDRESS: row.FULL_ADDRESS,
                        MAILING_NEIGHBORHOOD: row.MAILING_NEIGHBORHOOD,
                        ZIP_CODE: row.ZIP_CODE,
                        X_COORD: row.X_COORD,
                        Y_COORD: row.Y_COORD,
                        PARCEL: row.PARCEL,
                    }
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