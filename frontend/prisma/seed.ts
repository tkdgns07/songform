import prisma from './client';
import axios from 'axios';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

// Handle year rollover (e.g. December → January of next year)
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
  const dayIndex = (start + date - 1) % 7;
  return dayIndex === 0 || dayIndex === 6 ? true : false;
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
        j,
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
    const laborPlaylists = await prisma.laborCalendar.findMany({
      select: {
        music_url: true, // music_url 필드만 선택
      },
    });

    // wakeupCalendars를 받아옴 (wakeupCalendar)
    const wakeupPlaylist = await prisma.wakeupCalendar.findMany({
      select: {
        music_url: true, // music_url 필드만 선택
      },
    });

    // playlists와 wakeupCalendars 리스트를 합침
    const allPlaylists = [...laborPlaylists, ...wakeupPlaylist];

    // 합쳐진 playlists가 비어있으면 종료
    if (allPlaylists.length === 0) {
      console.log('No playlists found to delete');
      return;
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

    console.log('Playlists deleted successfully');
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function main() {
  try {
    // await deletePlaylists();

    // purge existing calendar records
    await prisma.wakeupCalendar.deleteMany();
    await prisma.laborCalendar.deleteMany();

    // seed current month
    await makeCalendar('wakeup', currentYear, currentMonth);
    await makeCalendar('labor',  currentYear, currentMonth);

    // seed next month
    await makeCalendar('wakeup', nextYear,  nextMonth);
    await makeCalendar('labor',  nextYear,  nextMonth);

    console.log('🌱  Seeding completed successfully');
  } catch (err) {
    console.error('❌  Seeding failed', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
