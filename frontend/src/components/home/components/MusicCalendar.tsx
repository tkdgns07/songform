'use client'
import { Dayinfo } from "@customtypes/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Music } from "lucide-react"
import { cn } from "@/lib/utils"

import SubmitButton from "./submitButton"

interface MusicCalendarProps {
    CalendarData : Dayinfo[]
    loading : boolean
    returnClickedDay: (clickedDayInfo: Dayinfo | null) => void
    musicType : boolean
}

const MusicCalendar:React.FC<MusicCalendarProps> = ({ CalendarData, loading, returnClickedDay, musicType }) => {
    const now: Date = new Date();
    const year: number = now.getFullYear();
    const monthName = now.toLocaleString("en-US", { month: "long" }) // "April"
    const date: number = now.getDate();

    const [clickedDay, setClickedDay] = useState<number | null>()

    function handleClickedDay (index : number) {
        if (clickedDay == index) {
            setClickedDay(null)
            returnClickedDay(null)
        } else {
            setClickedDay(index)
            returnClickedDay(CalendarData[index])
        }
    }

    return (
        <div className="w-full h-auto">
            <div className="flex justify-between items-center">
                <div className="flex flex-col justify-end p-2">
                    <p className="text-sm font-bold">{year}</p>
                    <p className="text-2xl font-bold">{monthName}</p>
                </div>
                <SubmitButton Dayinfo={clickedDay ? CalendarData[clickedDay] : null} musicType></SubmitButton>
            </div>
            <div className="grid grid-cols-7">
                <span className="day-name text-text text-xs">SUN</span>
                <span className="day-name text-xs">MON</span>
                <span className="day-name text-xs">TUE</span>
                <span className="day-name text-xs">WED</span>
                <span className="day-name text-xs">THU</span>
                <span className="day-name text-xs">FRI</span>
                <span className="day-name text-text text-xs">SAT</span>
            </div>
            <div className="w-full grid grid-cols-7">
                {loading ? 
                    (CalendarData.map((item, index) => {
                        return (
                            <button
                                id={item.day.toString()}
                                className={`flex flex-col items-center justify-center h-min-[46px]`}
                                onClick={item.day ? () => handleClickedDay(index) : undefined}
                            >
                                <div
                                    className={cn(
                                        "flex justify-center items-center mb-[1px] w-[30px] h-[30px] rounded-full duration-200",
                                        clickedDay == index ? "bg-text text-white" : undefined
                                        )}
                                >
                                    {item.day ? item.day : undefined}
                                </div>
                                <div
                                    className={`w-[30px] h-[3px] rounded-full bg-text ${item.day == date ? 'opacity-100' : 'opacity-0'}`}
                                ></div>
                                <div
                                    className={`w-[5px] h-[5px] rounded-full mt-[5px] bg-cusblue-normal ${item.music_url == 'None' ? 'opacity-0' : 'opacity-100'}`}
                                ></div>
                            </button>
                        );
                        })
                    ) : (
                        <Skeleton className="w-full h-full"></Skeleton>
                    )
                }
            </div>
        </div>
    )
}

export default MusicCalendar