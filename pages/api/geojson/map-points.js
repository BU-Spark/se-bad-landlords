// map-points show all properties that had violation in 2023
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // we use raw here because prisma doesn't have DISTINCT ON
    const results = await prisma.$queryRaw`
      select DISTINCT ON (bpv."sam_id")
        bpv."latitude",
        bpv."longitude",
        bpv."sam_id"
      from bpv bpv
      where bpv."status_dttm" BETWEEN '2023-01-01 00:00:00' AND '2023-12-31 23:59:59'`;

    // SQL to geoJson
    const geoJson = {
      type: "FeatureCollection",
      features: results.map(row => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [row.longitude, row.latitude],
        },
        properties: {
          SAM_ID: row.sam_id
        },
      })),
    };

    res.status(200).json(geoJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
}