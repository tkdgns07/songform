'use client'
import { Dayinfo } from "@customtypes/types"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/router"

import { cn } from "@/lib/utils"

interface SubmitButtonProps {
    Dayinfo : Dayinfo | null
    musicType : boolean
}

const SubmitButton:React.FC<SubmitButtonProps> = ({ Dayinfo, musicType }) => {
    const router = useRouter()

    function handleSubmit () {
        if (!Dayinfo) {
            toast.warning("날짜를 클릭해주세요")
        } else if (Dayinfo.student == "None") {
            toast.warning("신청되지 않은 날짜를 선택해주세요")
        } else if (musicType) {
            router.push(cn(
                `submit?date=${Dayinfo.year}.${Dayinfo.month}.${Dayinfo.day}&song=`,
                musicType ? 'wakeup' : 'labor'
            ))
        }
    }

    return (
        <button className="h-[30px] w-[30px] rounded-full bg-text shadow-lg shadow-text flex justify-center items-center mr-[10px] cursor-pointer">
            <Plus className="text-white" />
        </button>
    )
}

export default SubmitButton