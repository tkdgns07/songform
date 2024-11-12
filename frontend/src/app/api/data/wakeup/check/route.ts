import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";;

export async function POST(request: NextRequest) {
    try {
        const { year, month, student } = await request.json();

        const existingRecord = await prisma.wakeupCalendar.findFirst({
            where: {
                year : year,
                month : month,
                student : student,
            }
        });
        
        if (!existingRecord || !existingRecord.student) {return NextResponse.json({ status: 500, error: 'Internal Server Error' });}

        return NextResponse.json({ status: 200, data : existingRecord.student !== 'None' ? true : false});
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
