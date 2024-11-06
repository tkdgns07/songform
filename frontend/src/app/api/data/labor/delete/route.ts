import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";;



export async function POST(request: NextRequest) {
    try {
        const { year, month, day } = await request.json();

        const existingRecord = await prisma.laborCalendar.findFirst({
            where: {
                year : year,
                month : month,
                day : day,
            }
        });

        if (!existingRecord) {
            return NextResponse.json({ status: 404, error: 'Record not found' });
        }

        const deletedRecord = await prisma.laborCalendar.delete({
            where: { id: existingRecord.id },
        });

        return NextResponse.json({ status: 200, data: deletedRecord });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
