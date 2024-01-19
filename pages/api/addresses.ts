import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const searchAddress = req.query.search;

    const addresses = await prisma.sam.findMany({
      where: {
        FULL_ADDRESS: { contains: searchAddress, mode: 'insensitive' }, // this allows slower case values
      },
      take: 10,
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Issue finding address');
  } finally {
    await prisma.$disconnect();
  }
}