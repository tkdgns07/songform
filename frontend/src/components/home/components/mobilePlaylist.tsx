"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, useMotionValue, useTransform, useMotionValueEvent, useAnimation, type PanInfo } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";

import { Youtubeinfo, Dayinfo } from '../../../../types/types';

interface MobilePlaylistProps {
    Dayinfo : Dayinfo | null
}

const MobilePlaylist:React.FC<MobilePlaylistProps> = ({ Dayinfo }) => {
  const [playlistInfo, setPlaylistInfo] = useState<Youtubeinfo[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
      setLoading(true)
      async function fetchData (playlistId : string) {
        setPlaylistInfo([])
        try {
            const { videoIds } = (await axios.get("/api/getlist", {
                params: { playlistId },
                headers: {
                  Authorization: `Bearer ${process.env.CRON_SECRET}`,
                },
            })).data
            
            if (!videoIds) {
                toast.warning("다시 시도해 보세요")
                return
            } else {
                const { data } = await axios.get(`/api/youtubeinfo`, {
                    params: {
                      videoUrl: videoIds,
                    },
                    headers: {
                      Authorization: `Bearer ${process.env.CRON_SECRET}`,
                    },
                });
                setPlaylistInfo(data)
            }
        } catch (error : any) {
            setError(error)
            toast.error("다시 시도해보세요")
        } finally {
            setLoading(false)
        }
      }
      if (Dayinfo && Dayinfo.music_url !== "None") {
        fetchData(Dayinfo.music_url)
      }
  }, [Dayinfo])

  useEffect(() => {
    console.log(playlistInfo)
  }, [playlistInfo])

  const [windowHeight, setWindowHeight] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const controls = useAnimation()
  const y = useMotionValue(window.innerHeight)
  const [initialY, setInitialY] = useState(70)

  const THRESHOLD_PERCENTAGE = !Dayinfo || Dayinfo.music_url === 'None' ? 1.1 : 0.3;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)

      const handleResize = () => setWindowHeight(window.innerHeight)
      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
    }
  }, [window])

  useEffect(() => {
    if (Dayinfo && Dayinfo.id && Dayinfo.student) {
        setInitialY(100)
    } else {
        setInitialY(70)
    }
  }, [Dayinfo])

  useEffect(() => {
    controls.start({ y: -initialY+windowHeight })
  }, [windowHeight, initialY])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = windowHeight * THRESHOLD_PERCENTAGE
  
    // 드래그 거리 기준으로 판단
    if (-info.offset.y > threshold) {
      controls.start({ y: 70 })
      setIsOpen(true)
    } else {
      controls.start({ y: -initialY+windowHeight }) // 다시 내려옴
      setIsOpen(false)
    }
  }
    
  const background = useTransform(y, [-50, windowHeight - initialY], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"])
  const [movedHeight, setMovedHeight] = useState(initialY)

  useMotionValueEvent(y, "change", (latest) => {
    setMovedHeight(windowHeight - latest)
  })

  return (
    <div 
      className="absolute bottom-0 overflow-hidden z-20"
      style={{ height : movedHeight , width : "calc(100% - 16px)"}}
    >
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background }} />
      
      <motion.div
        drag="y"
        dragConstraints={{ top: !Dayinfo || Dayinfo.music_url === 'None' ? windowHeight-initialY : 50, bottom: windowHeight-initialY }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y, height: windowHeight }}
        initial={false}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div
            className="px-6"
            style={{ height : initialY - 24 }}
        >
            {Dayinfo ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center w-auto">
                    <p className="text-xl font-bold">{Dayinfo.month}월</p>
                    <p className="text-sm">{Dayinfo.day}일</p>
                  </div>
                  <p className="text-lg">{Dayinfo.student !== "None" ? Dayinfo.student : ""}</p>
                </div>
              </>
            ) : (
                <>
                    <p className="text-lg font-bold">날짜를 선택해주세요</p>
                </>
            )}
        </div>

        <div className="px-6 pb-8 overflow-auto" style={{ height: "calc(100% - 110px)" }}>
          {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4 mb-4">
                  <Skeleton className="w-[45px] h-[45px] rounded-lg" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ))
            ) : Array.isArray(playlistInfo) ? (
              playlistInfo.map((item) => (
                <a href={item.link} key={item.link}>
                  <div className="flex justify-start items-center w-full h-[60px] p-[5px] hover:bg-blue-50 mb-[5px] rounded-lg duration-100">
                    <div className="w-[45px] h-[45px] flex justify-center overflow-hidden items-center rounded-lg z-10">
                      <img
                        src={item.thumbnail}
                        alt={`${item.title} thumbnail`}
                        className="thumbnailimg"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="text-text text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </a>
              ))
            ) : null}
        </div>
      </motion.div>
    </div>
  )
}

export default MobilePlaylist