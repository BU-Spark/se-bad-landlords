import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
    try {
        const landlords = await prisma.violations_view.findMany();
        res.json(landlords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Can not fetch the landlords.' });
    }
};