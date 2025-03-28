import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentDate = now.getDate();

export async function POST(request: NextRequest) {
  try {
    const { year, month, student } = await request.json();

    if (month !== currentMonth && currentDate < 24) {
      return NextResponse.json({ status: 404, error: 'Not allowed date' });
    }

    const existingRecord = await prisma.laborCalendar.findFirst({
      where: {
        year: year,
        month: month,
        student : student,
      },
    });

    return NextResponse.json({
      status: 200,
      message: '',
      data: existingRecord ? true : false,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
