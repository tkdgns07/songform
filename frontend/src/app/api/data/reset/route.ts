import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const previousYear = currentMonth === 1 ? currentYear-1 : currentYear;
const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

async function createRecord(model : string, year : number, month : number, day : number, student : string, song : string) {
    if (model === 'wakeup'){
        await prisma.wakeupCalendar.create({
            data: {
                year: year,
                month: month,
                day: day,
                student: student,
                song : song,
            },
        });    
    }else if (model === 'labor'){
        await prisma.laborCalendar.create({
            data: {
                year: year,
                month: month,
                day: day,
                student: student,
                song : song,
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
        createRecord(model, year, month, 0, 'None', 'None')
    }
    for (let i = 1; i < daysInMonth+1; i++) {
        createRecord(model, year, month, i, 'None', 'None')
    }
    for (let i = 1; i < loopLimit-daysInMonth-startWeekday; i++) {
        createRecord(model, year, month, 0, 'None', 'None')
    }
}


export async function GET(request: NextRequest) {    
    try {
        const wakeupdeleteResult = await prisma.wakeupCalendar.deleteMany({
            where: {
                year : previousYear,
                month : previousMonth,
            }
        });

        const laborupdeleteResult = await prisma.laborCalendar.deleteMany({
            where: {
                year : previousYear,
                month : previousMonth,
            }
        });


        if (wakeupdeleteResult.count === 0 || laborupdeleteResult.count === 0) {
            return NextResponse.json({ status: 404, error: 'No records found to delete' });
        }

        makeCalendar('wakeup', currentYear, currentMonth)
        makeCalendar('labor', currentYear, currentMonth)   

        return NextResponse.json({ status: 200, message: "cron handled" });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}