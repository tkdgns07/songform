import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        const student = await prisma.wakeupCalendar.findUnique({
            where: { id: id },
        });

        if (!student) {
            return NextResponse.json({ status: 404, error: 'Record not found' });
        }

        return NextResponse.json({ status: 200, message : student ? false : true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
