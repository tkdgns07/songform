'use client'
import React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Icon } from '@iconify/react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';

import { toast } from "sonner"

interface inputdate{
  year : number;
  month : number;
  day : number;
}

interface Youtbeinfo{
  thumbnail : string;
  title : string;
  link : string;
}

function SubmitContent() {
    const[inputhover, setInputhover] = useState<boolean>(false)
    const[inputclicked, setInputclicked] = useState<boolean>(false)
    const[date, setDate] = useState<inputdate>({ year: 2007, month: 1, day: 22 });
    const[inputvalue, setInputvalue] = useState<string>('')
    const[videodetails, setVideoDetails] = useState<Youtbeinfo[]>([])
    const[videoIds, setVideoId] = useState<string[]>([])
    const[remove, setRemove] = useState<number>(-1)
    const { data: session } = useSession();
    const router = useRouter();
    const[loading, setLoading] = useState<boolean>(false)
    const[songtype, setSongtype] = useState<string>('')

    const dateParams = useSearchParams().get('date')?.toString();

    const songParams = useSearchParams().get('song')?.toString();

    useEffect(() => {
      if (!dateParams || (songParams !== 'labor' && songParams !== 'wakeup')){
        router.push(`/error?error=no-data-rended`)
      }else{
        const [year, month, day] = dateParams.split('.').map(part => parseInt(part, 10));
  
        const dateParts: inputdate = {
          year: year,
          month: month,
          day: day,
        };
        
        setSongtype(songParams)
        setDate(dateParts)
      }
    }, [dateParams, songParams])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputvalue(value);
      };

    useEffect(() => {
        if (inputvalue.length > 0 || videodetails.length > 0) {
            setInputhover(true)
        } else {
            setInputhover(false)
        }
      }, [inputvalue]);

    
      const getYoutubeVideoId = (url: string): string | null => {
        try {
            const urlObj = new URL(url);
    
            // youtu.be 형식의 URL 처리
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }
    
            // www.youtube.com 또는 youtube.com 형식의 URL 처리
            if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                return urlObj.searchParams.get('v');
            }
    
            return 'error';
        } catch (e) {
            // URL 형식이 아닌 경우, url을 그대로 비디오 ID로 사용
            return url;
        }
    };
  

    const renderclick = async (click: boolean) => {
      if (inputhover && click) {
        setInputclicked(true);
      } else if (inputhover) {
        setInputclicked(false);
    
        try {
          // API 요청을 통해 YouTube 비디오 정보를 가져옴
          const response = await axios.get('/api/youtubeinfo', {
            params: {
              videoUrl: inputvalue,
            },
          });
    
          const videoDetails: Youtbeinfo = response.data;
    
          if (videoDetails) {
            const videoid = getYoutubeVideoId(inputvalue)
            if(videoid !== null){
              setVideoId((prevDetails) => [...prevDetails, videoid])
            }
            setVideoDetails((prevDetails) => [...prevDetails, videoDetails]);
            setInputvalue('');
          } else {
            toast.error('유효한 유튜브를 입력하세요');
          }
        } catch (error) {
          console.error('Error fetching video details:', error);
          toast.error('유효한 유튜브를 입력하세요');
        }
      }
    };
        
    const removemusic = (index: number) => {
      setRemove(index);
      const delay = 200;
      setTimeout(() => {
        setVideoDetails(prevDetails => prevDetails.filter((_, i) => i !== index));
        setVideoId(prevDetails => (prevDetails || []).filter((_, i) => i !== index));
        setRemove(-1);
      }, delay);
    }

    let playlistId: string | null = null;

    const handleCreatePlaylist = async () => {
      setLoading(true)
      try {
        const playlistTitle = `${date?.year}.${date?.month}.${date?.day} 기상송`; // 재생목록 제목
        const playlistDescription = session?.user?.name 
            ? `${session.user.name} 신청` 
            : 'Unknown user 신청';
        const response = await axios.post('/api/createlist', {
          videoIds,
          playlistTitle,
          playlistDescription,
        });
    
        if (response.data.success) {
          playlistId = response.data.playlistId;
        } else {
          console.log('Failed to create playlist.');
        }
      } catch (error) {
        console.error('Error creating playlist:', error);
        router.push('/error?error=playlist-error')
      }
      setLoading(false)
    }

    const submitmusic = async () => {
      if(videodetails.length >= 5 && songtype == 'wakeup'){
        await handleCreatePlaylist()
        try {
          const data = {
            'year' : date.year,
            'month' : date.month,
            'day' : date.day,
            'student' : session?.user.name,
            'music_url' : playlistId,
          }
          setLoading(true)
          const response = await axios.post('http://127.0.0.1:8000/api/calendar-values/update-wcalendar/', data);
          toast.success('신청에 성공했습니다')
          router.push('/')
        } catch (error) {
          router.push('/error?error=wplaylist-error')
        }  
      }else if(videodetails.length < 5 && songtype == 'wakeup') {
        toast.warning("기상송은 최소 5곡 이상 신청해야 합니다.")
      }else if(videodetails.length == 5 && songtype == 'labor') {
        await handleCreatePlaylist()
        try {
          const data = {
            'year' : date.year,
            'month' : date.month,
            'day' : date.day,
            'student' : session?.user.name,
            'music_url' : playlistId,
          }
          setLoading(true)
          const response = await axios.post('http://127.0.0.1:8000/api/calendar-values/update-lcalendar/', data);
          toast.success('신청에 성공했습니다')
          router.push('/')
        } catch (error) {
          router.push('/error?error=lplaylist-error')
        }  
      }else if((videodetails.length < 5 || videodetails.length > 5) && songtype == 'labor'){
        toast.warning("노동요는 5곡을 신청해야 합니다.")
      }
    }
    
    return(
        <main className="flex flex-col items-center">
            <div className="flex flex-row">
            <div>
            <div className="w-[350px] md:w-[500px] h-[80px] calendarExp mb-[10px] rounded-xl py-[15px] px-[20px] flex flex-col justify-center">
              <p className="text-xl font-bold text-cusblue-deep">원하는 노래의 주소 입력</p>
              <div className="flex">
                <p className="text-sm text-text">유튜브 주소만으로&nbsp;</p>
                <p className="text-sm text-cusblue-normal font-bold">{`${songtype == 'labor' ? '노동요' : '기상송'}`}</p>
                <p className="text-sm text-text">을 신청할 수 있습니다</p>
              </div>
              <div></div>
            </div>
            <div className="flex flex-row mb-[7px] w-full justify-end">
              <div className="px-[8px] h-[18px] text-xs text-white bg-cusblue-normal rounded-full text-center mr-[1px]">{date.year}&nbsp;{date.month}&nbsp;{date.day}</div>
            </div>
            <div className={`${inputhover ? 'inputbig pl-[5px]' : 'inputsmall pl-[10px]'} inputcontainer flex flex-col justify-start w-[500px] border border-input bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-cusblue-normal focus-within:ring-offset-0`}>
                <div className="flex flex-col justify-center h-[40px]">
                    <input
                    type="text"
                    className="flex h-[40px] input border-0 focus:outline-none bg-transparent text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    value={inputvalue}
                    onChange={handleInputChange}
                    placeholder="유튜브 주소 입력"
                    />
                    <div className="hover-area flex justify-center items-center cursor-pointer" onMouseDown={()=>renderclick(true)} onMouseUp={()=>renderclick(false)}>
                        <Icon icon = "uil:arrow-right" className="text-white text-2xl"></Icon>
                    </div>
                    <div className={`moving-element bg-cusblue-normal ${inputhover ? 'move-l' : 'move-r'} ${inputclicked ? 'scaled' : 'scaleu'}`}></div>
                </div>
                <div className="flex justify-between items-center h-[40px]">
                    <span className={`text-base ${videodetails.length < 5 ? 'text-red-700' : 'text-green-700'}`}>{videodetails.length}/5</span>
                    <button type="button" className="bg-cusblue-normal w-[60px] h-[25px] flex justify-center items-center rounded hover:bg-cusblue-deep transition duration-200 text-2xs font-semibold mr-[5px]" onClick={()=>submitmusic()}>
                      <p className={`text-white ${!loading? '' : 'hidden'}`}>신청하기</p>
                      <span className={`loader w-[17px] aspect-square border-1 ${loading? '' : 'hidden'}`}></span>
                    </button>
                </div>
            </div>
            
            </div>
            </div>
            <div className="musicscontainer grid grid-cols-4 gap-4 mt-[30px] mb-[30px]">
              {videodetails.map((items, index) => {
                return(
                  <div className="relative">
                    <a href={items.link}>
                      <div className={`musiccontainer flex-col rounded-lg ${remove === index ? 'deleting' : ''}`}>
                        <img src={items.thumbnail} alt={items.title} className="thumbnailimg"/>
                        <div className="p-[10px] musictext items-center">
                          <span className="text-text text-xs">{items.title}</span>
                        </div>
                      </div>
                    </a>
                    <div className={`w-[24px] h-[24px] xicon z-10 ${remove === index ? 'deleting' : ''}`} onClick={()=>removemusic(index)}>
                      <Icon icon="mdi:remove" className=""/>
                    </div>
                  </div>
                )
              })}
            </div>
        </main>
    )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitContent />
    </Suspense>
  );
}