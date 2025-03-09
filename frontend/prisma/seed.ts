import prisma from './client';
import axios from 'axios';
import { NextResponse } from 'next/server';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

async function createcalRecord(
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
        disabled: disabled
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
  const dayIndex = (start + date - 1) % 7;
  return dayIndex === 0 || dayIndex === 6;
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

async function makeCalendar(model: string, year: number, month: number) {
  console.log(month)
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const all_day = startWeekday + daysInMonth;
  const loopLimit = (all_day <= 35 ? 36 : 43) - daysInMonth - startWeekday;

  for (let i = 1; i < startWeekday + 1; i++) {
    await createcalRecord(model, year, month, 0, 'None', 'None', true);
  }
  for (let i = 1; i < daysInMonth + 1; i++) {
    if(model == 'labor'){
      await createcalRecord(model, year, month, i, 'None', 'None', isWeekend(startWeekday, i) ? true : false)
    }else if(model == 'wakeup'){
      await createcalRecord(model, year, month, i, 'None', 'None', false);
    }
  }
  for (let i = 1; i < loopLimit; i++) {
    await createcalRecord(model, year, month, 0, 'None', 'None', true);
  }
}

async function main() {
  await deletePlaylists()

  await prisma.wakeupCalendar.deleteMany({});
  await prisma.laborCalendar.deleteMany({});

  try {
    await makeCalendar('wakeup', currentYear, currentMonth);
    await makeCalendar('wakeup', nextYear, nextMonth);
    await makeCalendar('labor', currentYear, currentMonth);
    await makeCalendar('labor', nextYear, nextMonth);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
