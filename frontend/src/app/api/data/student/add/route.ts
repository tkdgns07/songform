import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/../prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { id, birthday } = await request.json();

    const existingRecord = await prisma.students.findFirst({
      where: {
        id : id,
      },
    });
    if (!existingRecord) {
      return NextResponse.json({ status: 404, error: 'Student is not exist on DB' });
    }

    const updatedRecord = await prisma.students.update({
      where: { id: id },
      data: {
        birthday : birthday
      },
    });
    return NextResponse.json({
      status: 200,
      message: 'Update success',
      data: updatedRecord,
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'student-add-error' });
  } finally {
    await prisma.$disconnect();
  }
}
