import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const nextYear = currentMonth === 12 ? 1 : currentMonth + 1;
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

async function createRecord(model : string, year : number, month : number, day : number, student : string, song : string) {
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
    }
}

async function makeCalendar(model : string, year : number, month : number){
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const all_day = startWeekday + daysInMonth

    const loopLimit = (all_day <= 35 ? 36 : 43) - daysInMonth - startWeekday;

    for (let i = 1; i < startWeekday+1; i++) {
        await createRecord(model, year, month, 0, 'None', 'None')
    }
    for (let i = 1; i < daysInMonth+1; i++) {
        await createRecord(model, year, month, i, 'None', 'None')
    }
    for (let i = 1; i < loopLimit-daysInMonth-startWeekday; i++) {
        await createRecord(model, year, month, 0, 'None', 'None')
    }
}

export async function GET() {
    await prisma.wakeupCalendar.deleteMany({});
    await prisma.laborCalendar.deleteMany({});

    try {
        await makeCalendar('wakeup', currentYear, currentMonth)
        await makeCalendar('wakeup', nextYear, nextMonth)

        await makeCalendar('labor', currentYear, currentMonth)
        await makeCalendar('labor', nextYear, nextMonth)
        
        return NextResponse.json({ status: 200, message: "cron handled" });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}