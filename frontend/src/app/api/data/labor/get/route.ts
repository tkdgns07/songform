import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../../prisma/client";

export async function GET() {
    try {
        for (let i = 1; i <= 4; i++) {
            const data = await prisma.laborCalendar.findMany();
            
            if (data && data.length > 0) {
                const response = NextResponse.json({ status: 200, message: 'Render success', data: data });
                response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0, stale-while-revalidate=0");
                return response;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const response = NextResponse.json({ status: 404, error: 'No data found' });
        response.headers.set("Cache-Control", "no-store"); // 캐시 방지 설정
        return response;

    } catch (error) {
        console.error(error);
        const response = NextResponse.json({ status: 500, error: 'Internal Server Error' });
        response.headers.set("Cache-Control", "no-store"); // 캐시 방지 설정
        return response;

    } finally {
        await prisma.$disconnect();
    }
}
