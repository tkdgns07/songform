import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      await prisma.students.create({
        data : {
          id : id
        }
      })
      return NextResponse.json({ status: 200, message: 'Record not found' });
    }

    return NextResponse.json({ status: 200, data: student });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
