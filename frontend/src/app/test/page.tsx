"use client"

import { useState, useEffect, use } from "react"
import { motion, useMotionValue, useTransform, useAnimation, type PanInfo } from "framer-motion"

export default function DraggableBar() {
  const [windowHeight, setWindowHeight] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const controls = useAnimation()
  const y = useMotionValue(window.innerHeight) // 아래 완전히 숨긴 상태

  // Threshold percentage (of the screen height) to determine snap behavior
  const THRESHOLD_PERCENTAGE = 0.3

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)

      const handleResize = () => setWindowHeight(window.innerHeight)
      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
    }
  }, [window])

  useEffect(() => {
    controls.start({ y: -150+windowHeight })
  }, [windowHeight])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = windowHeight * THRESHOLD_PERCENTAGE
  
    // 드래그 거리 기준으로 판단
    if (-info.offset.y > threshold) {
      controls.start({ y: 70 }) // 완전히 열림
      setIsOpen(true)
    } else {
      controls.start({ y: -150+windowHeight }) // 다시 내려옴
      setIsOpen(false)
    }
  }
    
  const background = useTransform(y, [-50, windowHeight - 300], ["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.7)"])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-purple-100 to-blue-100">
      {/* Main content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Draggable Bar Demo</h1>
        <p className="text-gray-600">
          Drag the bar upward. If you don't drag it far enough, it will snap back down. If you drag it past the
          threshold, it will expand to full height.
        </p>
      </div>

      {/* Overlay */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background }} />

      {/* Draggable bar - full height from the beginning */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 70, bottom: windowHeight-300 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y, height: windowHeight }}
        initial={false} // motionValue 사용 중이라 무시되도록 false 처리
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <h2 className="text-xl font-semibold mb-4 h-[120px] flex items-center px-6">Draggable Content</h2>

        {/* Content */}
        <div className="px-6 pb-8 overflow-auto" style={{ height: "calc(100% - 150px)" }}>
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Item {i + 1}</h3>
                <p className="text-gray-500">This is a sample content item that appears when the drawer is expanded.</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

