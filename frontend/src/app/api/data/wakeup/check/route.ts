import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { year, month, day} = await request.json();

        const existingRecord = await prisma.wakeupCalendar.findFirst({
            where: {
                year : year,
                month : month,
                day : day,
            }
        });

        if (!existingRecord) {
            return NextResponse.json({ status: 404, error: 'Record not found' });
        }

        return NextResponse.json({ status: 200, message : existingRecord.student ? false : true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
