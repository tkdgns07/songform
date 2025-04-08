import { NextRequest, NextResponse } from 'next/server';
import prisma from '@pclient/client';

export const dynamic: 'force-dynamic' = 'force-dynamic';

export async function GET() {
  try {
    for (let i = 1; i <= 4; i++) {
      const data = await prisma.laborCalendar.findMany();

      if (data && data.length > 0) {
        return NextResponse.json({ data }, { status: 200 });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const response = NextResponse.json({ status: 404, error: 'No data found' });
    response.headers.set('Cache-Control', 'no-store'); // 캐시 방지 설정
    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json({
      status: 500,
      error: 'Internal Server Error',
    });
    response.headers.set('Cache-Control', 'no-store'); // 캐시 방지 설정
    return response;
  } finally {
    await prisma.$disconnect();
  }
}
