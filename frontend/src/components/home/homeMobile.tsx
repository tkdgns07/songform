'use client'
import { useEffect, useState } from "react"
import useCalendar from "@/hooks/useCalendar"

import { Youtubeinfo, CalendarDatasProps, Dayinfo } from "../../../types/types"

import MusicCalendar from "./components/MusicCalendar"
import MobilePlaylist from "@/components/home/components/mobilePlaylist"
import { useRouter } from "next/navigation"

const MobilePage = () => {
  const { calendarDatas, loading, error } = useCalendar()
  const [focusedDay, setFocusedDay] = useState<Dayinfo | null>(null)
  const [switchMusic, setSwitchMusic] = useState(true)

  const router = useRouter()
  useEffect(() => {
    router.push("/error?error=prepare")
  }, [])

  if (calendarDatas) {
    return (
      <main className="w-full h-full px-2 py-2 overflow-hidden">
        <div className="w-full flex justify-end mt-[60px]">
          <div className="w-full h-[45px] bg-gray-200 flex justify-between items-center p-[2px] rounded-full mb-[10px]">
            <div className="flex w-full h-full relative">
              <button
                type="button"
                className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                onClick={() => setSwitchMusic(true)}
              >
                기상송
              </button>
              <button
                type="button"
                className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                onClick={() => setSwitchMusic(false)}
              >
                노동요
              </button>
              <div
                className={`w-1/2 h-full bg-white shdow-xl rounded-full absolute transition-transform duration-300 ${switchMusic ? 'translate-x-0' : 'translate-x-full'}`}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto overflow-hidden">
          <MusicCalendar
            CalendarData={calendarDatas?.morningMusic.curruntMonth}
            loading
            returnClickedDay={setFocusedDay}
          ></MusicCalendar>
        </div>

        <div className="w-full h-auto">
          <MobilePlaylist Dayinfo={focusedDay}></MobilePlaylist>
        </div>
      </main>
    )  
  }
}

export default MobilePage