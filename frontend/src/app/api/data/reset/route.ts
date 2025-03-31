import { NextResponse } from 'next/server';
import prisma from '@/../prisma/client';
import axios from 'axios';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

async function createRecord(
  model: string,
  year: number,
  month: number,
  day: number,
  student: string,
  song: string,
  disabled: boolean,
) {
  if (model === 'wakeup') {
    await prisma.wakeupCalendar.create({
      data: {
        year: year,
        month: month,
        day: day,
        student: student,
        music_url: song,
        disabled: disabled,
      },
    });
  } else if (model === 'labor') {
    await prisma.laborCalendar.create({
      data: {
        year: year,
        month: month,
        day: day,
        student: student,
        music_url: song,
        disabled: disabled,
      },
    });
  }
}

function isWeekend(start: number, date: number): boolean {
  const dayIndex = (start + date) % 7;
  return dayIndex === 0 || dayIndex === 6;
}

async function makeCalendar(model: string, year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const all_day = startWeekday + daysInMonth;

  const loopLimit = (all_day <= 35 ? 36 : 43) - daysInMonth - startWeekday;

  for (let i = 1; i < startWeekday + 1; i++) {
    await createRecord(model, year, month, 0, 'None', 'None', true);
  }
  for (let j = 1; j < daysInMonth + 1; j++) {
    if (model == 'labor') {
      await createRecord(
        model,
        year,
        month,
        0,
        'None',
        'None',
        isWeekend(startWeekday, j) ? true : false,
      );
    } else if (model == 'wakeup') {
      await createRecord(model, year, month, j, 'None', 'None', false);
    }
  }
  for (let k = 1; k < loopLimit; k++) {
    await createRecord(model, year, month, 0, 'None', 'None', true);
  }
}

async function deletePlaylists() {
  try {
    // playlists를 받아옴 (laborCalendar)
    const playlists = await prisma.laborCalendar.findMany({
      where: {
        month: currentMonth - 1, // 한 달 전의 데이터를 찾음
      },
      select: {
        music_url: true, // music_url 필드만 선택
      },
    });

    // wakeupCalendars를 받아옴 (wakeupCalendar)
    const wakeupCalendars = await prisma.wakeupCalendar.findMany({
      where: {
        month: currentMonth - 1, // 한 달 전의 데이터를 찾음
      },
      select: {
        music_url: true, // music_url 필드만 선택
      },
    });

    // playlists와 wakeupCalendars 리스트를 합침
    const allPlaylists = [...playlists, ...wakeupCalendars];

    // 합쳐진 playlists가 비어있으면 종료
    if (allPlaylists.length === 0) {
      return NextResponse.json({
        status: 404,
        error: 'No playlists found to delete',
      });
    }

    // axios.delete 호출을 async로 순차적으로 처리
    for (const item of allPlaylists) {
      await axios.delete(`${process.env.NEXTAUTH_URL}/api/deletelist`, {
        data: {
          playlistId: item.music_url, // playlistId를 music_url로 설정
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Playlists deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: 'Youtube API error on deleting PlayList',
    });
  }
}

export async function GET() {
  await deletePlaylists();

  try {
    const wakeupdeleteResult = await prisma.wakeupCalendar.deleteMany({
      where: {
        year: previousYear,
        month: previousMonth,
      },
    });

    const laborupdeleteResult = await prisma.laborCalendar.deleteMany({
      where: {
        year: previousYear,
        month: previousMonth,
      },
    });

    if (wakeupdeleteResult.count === 0 || laborupdeleteResult.count === 0) {
      return NextResponse.json({
        status: 404,
        error: 'No records found to delete',
      });
    }

    await makeCalendar('wakeup', nextYear, nextMonth);
    await makeCalendar('labor', nextYear, nextMonth);

    return NextResponse.json({ status: 200, message: 'cron handled' });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
