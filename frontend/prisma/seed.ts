import prisma from './client';
import axios from 'axios';

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

type ModelType = 'wakeup' | 'labor';

function isWeekend(start: number, date: number): boolean {
  const dayIndex = (start + date - 1) % 7;
  return dayIndex === 0 || dayIndex === 6;
}

async function deletePlaylists() {
  try {
    const [laborPlaylists, wakeupPlaylists] = await Promise.all([
      prisma.laborCalendar.findMany({
        select: { music_url: true },
      }),
      prisma.wakeupCalendar.findMany({
        select: { music_url: true },
      }),
    ]);

    const allPlaylists = [...laborPlaylists, ...wakeupPlaylists]
      .map((item) => item.music_url)
      .filter((url) => url && url !== 'None');

    if (allPlaylists.length === 0) return;

    await Promise.allSettled(
      allPlaylists.map((playlistId) =>
        axios.delete(`${process.env.NEXTAUTH_URL}/api/deletelist`, {
          data: { playlistId },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        }),
      ),
    );
  } catch (error) {
    console.error('YouTube API error on deleting PlayList:', error);
  }
}

async function makeCalendar(model: ModelType, year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const all_day = startWeekday + daysInMonth;
  const loopLimit = (all_day <= 35 ? 36 : 43) - daysInMonth - startWeekday;

  const records = [];

  for (let i = 1; i <= startWeekday; i++) {
    records.push({
      year,
      month,
      day: 0,
      student: 'None',
      music_url: 'None',
      disabled: true,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isDisabled = model === 'labor' ? isWeekend(startWeekday, i) : false;
    records.push({
      year,
      month,
      day: i,
      student: 'None',
      music_url: 'None',
      disabled: isDisabled,
    });
  }

  for (let i = 1; i < loopLimit; i++) {
    records.push({
      year,
      month,
      day: 0,
      student: 'None',
      music_url: 'None',
      disabled: true,
    });
  }

  if (model === 'wakeup') {
    await prisma.wakeupCalendar.createMany({ data: records });
  } else {
    await prisma.laborCalendar.createMany({ data: records });
  }
}

export async function GET() {
  await deletePlaylists();

  await Promise.all([
    prisma.wakeupCalendar.deleteMany({}),
    prisma.laborCalendar.deleteMany({}),
  ]);

  try {
    await Promise.all([
      makeCalendar('wakeup', currentYear, currentMonth),
      makeCalendar('wakeup', nextYear, nextMonth),
      makeCalendar('labor', currentYear, currentMonth),
      makeCalendar('labor', nextYear, nextMonth),
    ]);
  } catch (error) {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
