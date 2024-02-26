import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// This api needs improvement in the datasets if wanting to use it.
// This happens because bpv only contains property with violations.
// SAM dataset has all street address.
// To use this api, there will need to be other dataset than bpv.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const SAM_ADDRESS_ID = req.query.samId as string;
    console.log(SAM_ADDRESS_ID)
    console.log(typeof(SAM_ADDRESS_ID))
    const propertyData = await prisma.bpv.findFirst({
      where: { sam_id: SAM_ADDRESS_ID },
    });

    res.status(200).json(propertyData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Issue finding address');
  } finally {
    await prisma.$disconnect();
  }
}