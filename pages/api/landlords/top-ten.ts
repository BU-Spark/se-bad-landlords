import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TopTen = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const landlords = await prisma.violations_view.findMany();
        res.json(landlords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Can not fetch the landlords.' });
    } finally {
        await prisma.$disconnect();
    }
};

export default TopTen;