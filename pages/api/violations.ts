import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// const prisma = new PrismaClient();
import prisma from "../../prisma/prismaClient"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sam_id = Array.isArray(req.query.sam_id) ? req.query.sam_id[0] : req.query.sam_id;

        if (!sam_id) {
            res.status(400).send('SAM ID is missing in the request');
            return;
        }

        // console.log(sam_id);
    
        const violations = await prisma.bpv.findMany({
            where: {
                sam_id: { equals: sam_id, mode: 'insensitive' }, // this allows slower case values
            },
            take: 10,
        });

        // console.log(violations);

        if (violations.length > 0) {
            res.status(200).json(violations);
        } else {
            res.status(404).send('No violations found for the provided address');
        }
    
    } catch (error) {
        console.error(error);
        res.status(500).send('Issue finding violations');
    } finally {
        await prisma.$disconnect();
    }
}