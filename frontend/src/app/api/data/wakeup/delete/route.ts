import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";;

export async function POST(request: NextRequest) {
    try {
        const { year, month, day } = await request.json();

        const existingRecord = await prisma.wakeupCalendar.findFirst({
            where: {
                year: year,
                month: month,
                day: day,
            },
        });

        if (!existingRecord) {
            return NextResponse.json({ status: 404, error: 'Record not found', data: existingRecord });
        }

        const deletedRecord = await prisma.wakeupCalendar.update({
            where: { id: existingRecord.id },
            data: { student: 'None', music_url: 'None' },
        });

        return NextResponse.json({ status: 200, data: deletedRecord });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' }); // 명시적으로 반환
    } finally {
        await prisma.$disconnect();
    }
}
