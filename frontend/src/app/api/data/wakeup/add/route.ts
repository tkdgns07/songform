import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const response = await axios.post(
    `${process.env.NEXTAUTH_URL}/api/data/wakeup/check`,
    {
      request,
    },
  );
  if (response.data == true) {
    return NextResponse.json({ status: 404, error: 'already-submit' });
  }
  try {
    const { year, month, day, student, music_url } = await request.json();

    const existingRecord = await prisma.wakeupCalendar.findFirst({
      where: {
        year: year,
        month: month,
        day: day,
      },
    });
    if (!existingRecord) {
      return NextResponse.json({ status: 404, error: 'wplaylist-error' });
    }

    const updatedRecord = await prisma.wakeupCalendar.update({
      where: { id: existingRecord.id },
      data: {
        student: student,
        music_url: music_url,
      },
    });
    return NextResponse.json({
      status: 200,
      message: 'Update success',
      data: updatedRecord,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'wplaylist-error' });
  } finally {
    await prisma.$disconnect();
  }
}
