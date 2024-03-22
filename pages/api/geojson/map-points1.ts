// map-points1 shows the properties with more than 6 or more violations
import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RowData = {
  _count: { sam_id: number };
  latitude: string;
  longitude: string;
  sam_id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 24));

    // format the date to the string format in our database
    const formatDate = (date: Date): string => {
      const YY = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      
      return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    }
    
    // group by and counts then returns property with higher than 5 violations past 12 months
    const results = await prisma.bpv.groupBy({
      by: ['latitude', 'longitude', 'sam_id'],
      where: {
        status_dttm: {
          gte: formatDate(twelveMonthsAgo)
        }
      },
      _count: {
        sam_id: true,
      },
      having: {
        sam_id: {
          _count: {
            gt: 5
          }
        }
      },
      orderBy: {
        _count: {
          sam_id: 'desc'
        }
      }
    });

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
  } finally {
    await prisma.$disconnect();
  }
}