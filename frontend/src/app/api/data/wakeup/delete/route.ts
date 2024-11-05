import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { year, month, day } = await request.json();

        console.log(year, month, day);

        const existingRecord = await prisma.wakeupCalendar.findFirst({
            where: {
                year: year,
                month: month,
                day: day,
            },
        });

        console.log(existingRecord);

        if (!existingRecord) {
            return NextResponse.json({ status: 404, error: 'Record not found', data: existingRecord });
        }

        const deletedRecord = await prisma.wakeupCalendar.update({
            where: { id: existingRecord.id },
            data: { student: 'None', music_url: 'None' },
        });

        return NextResponse.json({ status: 200, data: deletedRecord });
    } catch (error) {
        console.error('Error updating record:', error); // 에러 로그 추가
        return NextResponse.json({ status: 500, error: 'Internal Server Error' }); // 명시적으로 반환
    } finally {
        await prisma.$disconnect();
    }
}
