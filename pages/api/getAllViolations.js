import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const results = await prisma.$queryRaw`
      select
        property."PID",
        property."OWNER",
        parcel."LOC_ID",
        parcel."Shape_STLength__",
        sam."FULL_ADDRESS",
        sam."MAILING_NEIGHBORHOOD",
        sam."ZIP_CODE",
        bpv."code",
        bpv."description",
        bpv."latitude",
        bpv."longitude"
      from property property
      join parcel parcel on property."PID" = parcel."MAP_PAR_ID"
      join sam sam on property."PID" = sam."PARCEL"
      join bpv bpv on sam."SAM_ADDRESS_ID" = bpv."sam_id"
      where cast(property."year" as integer) = 2023;`;

    // SQL to geoJson
    const geoJson = {
      type: "FeatureCollection",
      features: results.map((row, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [row.longitude, row.latitude],
        },
        properties: {
          OID_: index + 1, // do we need this?
          Join_Count: "1",
          TARGET_FID: index + 1, // do we need this?
          case_no: row.case_no,
          code: row.code,
          value: "N/A", // what is this value?
          description: row.description,
          SHAPE_Leng: row.Shape_STLength__, // what is this value?
          MAP_PAR_ID: row.PID,
          LOC_ID: row.LOC_ID,
          OWNER1: row.OWNER,
          ADDRESS: `${row.FULL_ADDRESS}, ${row.MAILING_NEIGHBORHOOD}, ${row.ZIP_CODE}`,
        },
      })),
    };

    res.status(200).json(geoJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
}