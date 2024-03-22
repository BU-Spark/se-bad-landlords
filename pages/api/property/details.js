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
            PARCEL: true
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

    if (!propertyData) {
        return res.status(404).json({ error: 'Property record not found.' });
    }
    
    // use this to restrict code that makes landlord ScoffLaw
    // const codesRestiction = ['code1', 'code2'];

    const bpvData = await prisma.bpv.findFirst({
        where: {
            sam_id: sam_id,
            // code: {
            //     in: codesRestiction
            // },
        },
        select: {
            status: true,
            code: true,
            description: true
        }
    });

    if (!bpvData) {
        return res.status(404).json({ error: 'BPV record not found.' });
    }

    const combinedData = {
        ...samData,
        owner: propertyData ? propertyData.OWNER : null,
        bpv: bpvData
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  } finally {
    await prisma.$disconnect();
  }
}