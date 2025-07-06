'use client'
import { useEffect, useState } from "react"
import useCalendar from "@/hooks/useCalendar"

import { Youtubeinfo, CalendarDatasProps, Dayinfo } from "../../../types/types"

import MusicCalendar from "./components/MusicCalendar"
import MobilePlaylist from "@/components/home/components/mobilePlaylist"

const MobilePage = () => {
  const { calendarDatas, loading, error } = useCalendar()
  const [focusedDay, setFocusedDay] = useState<Dayinfo | null>(null)
  const [musicType, setMusicType] = useState(true)

  if (calendarDatas) {
    return (
      <main className="w-full h-full px-2 py-2 overflow-hidden">
        <div className="w-full flex justify-end mt-[60px]">
          <div className="w-full h-[45px] bg-gray-200 flex justify-between items-center p-[2px] rounded-full mb-[10px]">
            <div className="flex w-full h-full relative">
              <button
                type="button"
                className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                onClick={() => setMusicType(true)}
              >
                기상송
              </button>
              <button
                type="button"
                className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                onClick={() => setMusicType(false)}
              >
                노동요
              </button>
              <div
                className={`w-1/2 h-full bg-white shdow-xl rounded-full absolute transition-transform duration-300 ${musicType ? 'translate-x-0' : 'translate-x-full'}`}
              ></div>
            </div>
          </div>
        </div>
        <div
          className="w-full h-fit overflow-hidden"
          style={{
            height : "calc(100% - 223px)"
          }}
        >
          <MusicCalendar
            CalendarData={calendarDatas?.morningMusic.curruntMonth}
            loading
            returnClickedDay={setFocusedDay}
            musicType
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