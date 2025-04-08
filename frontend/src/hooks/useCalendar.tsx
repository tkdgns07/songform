'use client'
import { useEffect, useState } from "react"
import axios from "axios"

import { CalendarDatasProps, Dayinfo } from "@customtypes/types"

const now: Date = new Date();
const year: number = now.getFullYear();
const month: number = now.getMonth() + 1;
const date: number = now.getDate();

export default function useCalendar () {
    const [calendarDatas, setCalendarDatas] = useState<CalendarDatasProps>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    async function fetchData() {
        const moringMusic_response = await axios.get(`/api/data/wakeup/get`, {
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        });
      
        const moringMusic_sortedResponse: Dayinfo[] = moringMusic_response.data.data.sort(
          (a: Dayinfo, b: Dayinfo) => a.id - b.id,
        );
      
        const morningMusic_curruntMonth = moringMusic_sortedResponse.filter((item) => item.month === month);
        const morningMusic_nextMonth = moringMusic_sortedResponse.filter((item) => item.month !== month);

        const workMusic_response = await axios.get(`/api/data/wakeup/get`, {
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
        });
        
        const workMusic_sortedResponse: Dayinfo[] = workMusic_response.data.data.sort(
        (a: Dayinfo, b: Dayinfo) => a.id - b.id,
        );
        
        const workMusic_curruntMonth = workMusic_sortedResponse.filter((item) => item.month === month);
        const workMusic_nextMonth = workMusic_sortedResponse.filter((item) => item.month !== month);
      
        setCalendarDatas({
            morningMusic: {
                curruntMonth : morningMusic_curruntMonth,
                nextMonth : morningMusic_nextMonth,
            },
            workMusic: {
                curruntMonth: workMusic_curruntMonth,
                nextMonth: workMusic_nextMonth,
            },
        })
    }

    useEffect(() => {
        setLoading(false)
        try {
            fetchData()
        } catch (error : any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    return { calendarDatas, loading, error }
}

