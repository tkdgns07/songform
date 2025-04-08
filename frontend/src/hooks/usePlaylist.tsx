'use client'
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"

import { Youtubeinfo } from "@customtypes/types"
import { userAgent } from "next/server"

export default function usePlaylist ( playlistId : string  | null) {
    console.log("live")

    const [playlistInfo, setPlaylistInfo] = useState<Youtubeinfo[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        setLoading(true)
        async function fetchData () {
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
        if (playlistId) fetchData()
    }, [])

    return { playlistInfo, error, loading }
}