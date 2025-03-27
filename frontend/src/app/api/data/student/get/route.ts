import { NextRequest, NextResponse } from 'next/server';
import prisma from '@pclient/client';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
    });

    if (!student) {
      const newStudent = await prisma.students.create({
        data: {
          id: parseInt(id),
        },
      });
      return NextResponse.json({ status: 200, data: newStudent });
    }

    return NextResponse.json({ status: 200, data: student });
  } catch (error) {
    return NextResponse.json({ status: 500, error });
  } finally {
    await prisma.$disconnect();
  }
}
