const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

async function createcalRecord(model : string, year : number, month : number, day : number, student : string, song : string) {
    if (model === 'wakeup'){
        await prisma.wakeupCalendar.create({
            data: {
                year: year,
                month: month,
                day: day,
                student: student,
                music_url : song,
            },
        });
    }else if (model === 'labor'){
        await prisma.laborCalendar.create({
            data: {
                year: year,
                month: month,
                day: day,
                student: student,
                music_url : song,
            },
        });    
    };
};

async function makeCalendar(model : string, year : number, month : number){
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const all_day = startWeekday + daysInMonth;

    const loopLimit = (all_day <= 35 ? 36 : 43) - daysInMonth - startWeekday;

    for (let i = 1; i < startWeekday+1; i++) {
        await createcalRecord(model, year, month, 0, 'None', 'None')
    };
    for (let i = 1; i < daysInMonth+1; i++) {
        await createcalRecord(model, year, month, i, 'None', 'None')
    };
    for (let i = 1; i < loopLimit; i++) {
        await createcalRecord(model, year, month, 0, 'None', 'None')
    };
};



async function main() {
    await prisma.wakeupCalendar.deleteMany({});
    await prisma.laborCalendar.deleteMany({});

    try {
        await makeCalendar('wakeup', currentYear, currentMonth)
        await makeCalendar('wakeup', nextYear, nextMonth)

        await makeCalendar('labor', currentYear, currentMonth)
        await makeCalendar('labor', nextYear, nextMonth)
        
    } catch (error) {
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    };
};

main();