import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../prisma/client";

export async function GET(request: NextRequest) {

    try {
        return NextResponse.json({ status: 200, message: 'Render success', data: 'ss' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}