// details api gets the sam_id passed.
// then grabs the data related to sam_id
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const sam_id = req.query.sam_id;

    if (!sam_id) {
        return res.status(400).json({ error: 'SAM_ID is required.' });
    }

    const samData = await prisma.sam.findFirst({
        where: {
            SAM_ADDRESS_ID: sam_id,
        },
        select: {
            FULL_ADDRESS: true,
            MAILING_NEIGHBORHOOD: true,
            ZIP_CODE: true,
        },
    });
  
    if (!samData) {
        return res.status(404).json({ error: 'SAM record not found.' });
    }
  
    const propertyData = await prisma.property.findFirst({
        where: {
            PID: samData.PARCEL,
        },
        select: {
            OWNER: true
        }
    });
  
    const bpvData = await prisma.bpv.findFirst({
        where: {
            sam_id: sam_id,
        },
        select: {
            status: true,
            code: true,
            description: true
        }
    });

    const combinedData = {
        ...samData,
        owner: propertyData ? propertyData.OWNER : null,
        bpv: bpvData
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}