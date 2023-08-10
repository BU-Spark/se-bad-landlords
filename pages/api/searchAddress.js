import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const searchAddress = req.query.address;

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