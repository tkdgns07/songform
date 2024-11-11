import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";

async function fetchDataWithDelay() {
    for (let i = 1; i <= 4; i++) {
        const data = await prisma.wakeupCalendar.findMany();

        if (data && data.length > 0) {
            return { found: true, data };
        }

        // 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return { found: false };
}

export async function GET(request: NextRequest) {
    try {
        const result = await fetchDataWithDelay();

        if (result.found) {
            return NextResponse.json({ status: 200, message: 'Render success', data: result.data });
        } else {
            return NextResponse.json({ status: 404, error: 'No data found after 4 seconds' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
