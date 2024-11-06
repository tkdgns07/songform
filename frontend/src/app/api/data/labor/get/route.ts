import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";;


export async function GET(request: NextRequest) {
    try {
        const data = await prisma.laborCalendar.findMany();

        const response = NextResponse.json({ status: 200, message : 'Render success', data: data })
        response.headers.set('Cache-Control', 'no-store');

        return response
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
