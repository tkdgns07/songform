import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client"

export async function GET(request: NextRequest) {
    try {
        for (let i = 1; i < 5; i++){
            const data = await prisma.laborCalendar.findMany();
            console.log(data)
            if (data){
                return NextResponse.json({ status: 200, message : 'Render success', data: data });
            }
        }
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
