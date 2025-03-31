import prisma from './client';
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const previousYear = currentYear
const previousMonth = currentMonth

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
export async function GET() {
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

    await makeCalendar('wakeup', nextYear, nextMonth);
    await makeCalendar('labor', nextYear, nextMonth);

}
