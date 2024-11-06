import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";;



export async function POST(request: NextRequest) {
    try {
        const { year, month, day, student, music_url } = await request.json();

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

        const updatedRecord = await prisma.wakeupCalendar.update({
            where: { id: existingRecord.id },
            data: { 
                student: student,
                music_url: music_url,
            }
        });

        return NextResponse.json({ status: 200, data: updatedRecord });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
