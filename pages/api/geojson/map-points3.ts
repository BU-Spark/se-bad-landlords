import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type RowData = {
    SAM_ADDRESS_ID: string,
    X_COORD: string | null,
    Y_COORD: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const neighborhoodName = req.query.neighborhoodName as string;
    try {
        // complete the code below
        const results: RowData[] = await prisma.sam.findMany({
            where: {
                MAILING_NEIGHBORHOOD: neighborhoodName,
            },
            select: {
                SAM_ADDRESS_ID: true,
                X_COORD: true,
                Y_COORD: true,
            },
            take: 3
        });
        console.log(`fetching data with MAILING_NEIGHBORHOOD=${neighborhoodName}...`, results)
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Issue finding address with MAILING_NEIGHBORHOOD=${neighborhoodName}`);
    } finally {
        await prisma.$disconnect();
    }
}