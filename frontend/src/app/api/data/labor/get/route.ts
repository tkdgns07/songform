import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const data = await prisma.laborCalendar.findMany();
        return NextResponse.json({ status: 200, message : 'Render success', data: data });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
