import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const nextYear = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);

    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    
    try {
        const deleteResult = await prisma.wakeupCalendar.deleteMany({
            where: {
                year : previousYear,
                month : previousMonth,
            }
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({ status: 404, error: 'No records found to delete' });
        }

        const all_day = startWeekday + daysInMonth
        if (all_day <= 35) {
            for (let i = 1; i < startWeekday+1; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: 0,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
            for (let i = 1; i < daysInMonth+1; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: i,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
            for (let i = 1; i < 36-daysInMonth-startWeekday; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: 0,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
        }else if(all_day > 35){
            for (let i = 1; i < startWeekday+1; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: 0,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
            for (let i = 1; i < daysInMonth+1; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: i,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
            for (let i = 1; i < 43-daysInMonth-startWeekday; i++) {
                const createdRecords = await prisma.wakeupCalendar.create({
                    data: {
                        year: nextYear,
                        month: nextMonth,
                        day: 0,
                        student: 'None',
                        song : 'None'
                    },
                });
            }
        }
        
        

        return NextResponse.json({ status: 200, message: "cron handled" });
    } catch (error) {
        return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}