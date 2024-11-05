import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { year, month, student } = await request.json();

        const existingRecord = await prisma.laborCalendar.findFirst({
            where: {
                year : year,
                month : month,
                student : student,
            }
        });

        return NextResponse.json({ status: 200, data : existingRecord ? 'true' : 'false' });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
