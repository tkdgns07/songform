import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client"

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.wakeupCalendar.findMany();

        return NextResponse.json({ status: 200, message : 'Render success', data: data }).headers.set('Cache-Control', 'no-store');
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
