import { NextResponse } from 'next/server';
import prisma from '@/../prisma/client';
import axios from 'axios';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

async function createRecord(
  model: string,
  year: number,
  month: number,
  day: number,
  student: string,
  song: string,
  weekend?: boolean,
) {
  if (model === 'wakeup') {
    await prisma.wakeupCalendar.create({
      data: {
        year: year,
        month: month,
        day: day,
        student: student,
        music_url: song,
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
        weekend: weekend,
      },
    });
  }
}

function isWeekend(start: number, date: number): boolean {
  const dayIndex = (start + date - 1) % 7;
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
    await createRecord(model, year, month, 0, 'None', 'None');
  }
  for (let j = 1; j < daysInMonth + 1; j++) {
    if(model == 'labor'){
      await createRecord(model, year, month, 0, 'None', 'None', isWeekend(startWeekday, j) ? true : false)
    }else if(model == 'wakeup'){
      await createRecord(model, year, month, j, 'None', 'None');
    }
  }
  for (let k = 1; k < loopLimit; k++) {
    await createRecord(model, year, month, 0, 'None', 'None');
  }
}

async function deletePlaylists () {
  const playlists = await prisma.laborCalendar.findMany({
    where : {
      month : currentMonth -1,
    },
    select : {
      music_url : true,
    },
  })
  try {
    (async () => {
      for (const item of playlists) {
        const response = await axios.delete(`${process.env.NEXTAUTH_URL}/api/deletelist`, {
          data: {
            playlistId: item.music_url,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        });
      }
    })();
  }catch(error){
    return NextResponse.json({status : 500, error : 'Youtube API error on deleting PlayList'})
  }
}

export async function GET() {
  await deletePlaylists()

  await prisma.wakeupCalendar.deleteMany({});
  await prisma.laborCalendar.deleteMany({});

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

    await makeCalendar('wakeup', currentYear, currentMonth);
    await makeCalendar('labor', currentYear, currentMonth);

    return NextResponse.json({ status: 200, message: 'cron handled' });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
