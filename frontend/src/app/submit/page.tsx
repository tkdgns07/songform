'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';

interface inputdate {
  year: number;
  month: number;
  day: number;
}

interface Youtbeinfo {
  thumbnail: string;
  title: string;
  link: string;
}

function SubmitContent() {
  const [inputhover, setInputhover] = useState<boolean>(false);
  const [inputclicked, setInputclicked] = useState<boolean>(false);
  const [date, setDate] = useState<inputdate>({
    year: 2007,
    month: 1,
    day: 22,
  });
  const [inputvalue, setInputvalue] = useState<string>('');
  const [videodetails, setVideoDetails] = useState<Youtbeinfo[]>([]);
  const [videoIds, setVideoId] = useState<string[]>([]);
  const [remove, setRemove] = useState<number>(-1);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [songtype, setSongtype] = useState<string>('');

  const dateParams = useSearchParams().get('date')?.toString();

  const songParams = useSearchParams().get('song')?.toString();

  useEffect(() => {
    if (!dateParams || (songParams !== 'labor' && songParams !== 'wakeup')) {
      router.push(`/error?error=no-data-rended`);
    } else {
      const [year, month, day] = dateParams
        .split('.')
        .map((part) => parseInt(part, 10));

      const dateParts: inputdate = {
        year: year,
        month: month,
        day: day,
      };

      setSongtype(songParams);
      setDate(dateParts);
    }
  }, [dateParams, songParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputvalue(value);
  };

  useEffect(() => {
    if (inputvalue.length > 0 || videodetails.length > 0) {
      setInputhover(true);
    } else {
      setInputhover(false);
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
      if (
        urlObj.hostname === 'www.youtube.com' ||
        urlObj.hostname === 'youtube.com'
      ) {
        return urlObj.searchParams.get('v');
      }

      return 'error';
    } catch (e) {
      return url;
    }
  };

  const renderclick = async (click: boolean) => {
    if (inputhover && click) {
      setInputclicked(true);
    } else if (inputhover) {
      setInputclicked(false);

      try {
        const response = await axios.get(`/api/youtubeinfo`, {
          params: {
            videoUrl: inputvalue,
          },
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        });

        const videoDetails: Youtbeinfo = response.data;

        if (videoDetails) {
          const videoid = getYoutubeVideoId(inputvalue);
          if (videoid !== null) {
            setVideoId((prevDetails) => [...prevDetails, videoid]);
          }
          setVideoDetails((prevDetails) => [...prevDetails, videoDetails]);
          setInputvalue('');
        } else {
          toast.error('유효한 유튜브를 입력하세요');
        }
      } catch (error) {
        toast.error('유효한 유튜브를 입력하세요');
      }
    }
  };

  const removemusic = (index: number) => {
    setRemove(index);
    const delay = 200;
    setTimeout(() => {
      setVideoDetails((prevDetails) =>
        prevDetails.filter((_, i) => i !== index),
      );
      setVideoId((prevDetails) =>
        (prevDetails || []).filter((_, i) => i !== index),
      );
      setRemove(-1);
    }, delay);
  };

  let playlistId: string | null = null;

  const handleCreatePlaylist = async (type: boolean) => {
    setLoading(true);
    try {
      const playlistTitle = `${date?.year}/${date?.month}/${date?.day} ${type ? '기상송' : '노동요'}`; // 재생목록 제목
      const playlistDescription = session?.user?.name
        ? `${session.user.id} ${session.user.name} 신청`
        : 'Unknown user 신청';
      const response = await axios.post(`/api/createlist`, {
        videoIds,
        playlistTitle,
        playlistDescription,
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (response.data.success) {
        playlistId = response.data.playlistId;
      }
    } catch (error) {
      router.push('/error?error=playlist-make-error');
      return 'error'
    }
    setLoading(false);
  };

  const checkStudent = async () => {
    try {
      const data = {
        year: date.year,
        month: date.month,
        student: `${session?.user.id} ${session?.user.name}`,
      };
      const response = await axios.post(
        `api/data/${songParams === 'wakeup' ? 'wakeup' : 'labor'}/check/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        },
      );

      const serverMessage = response.data.error;

      return serverMessage;
    } catch (error) {
      router.push('/error?error=${error}');
      return null;
    }
  };

  const submitmusic = async () => {
    setLoading(true);
    const check = await checkStudent();
    if (check == 'Already submited') {
      router.push('/error?error=already-submit');
      return null;
    }else if(check == 'Not submitable date'){
      router.push('/error?error=disabled-submit');
      return null;
    }else if(check == 'Not allowed date'){
      router.push('/error?error=disabled-submit');
      return null;
    }
    if (!check) {
      if (videodetails.length >= 5 && songtype == 'wakeup') {
        const responese = await handleCreatePlaylist(true);
        if (responese == 'error'){
          return null
        }
        try {
          const data = {
            year: date.year,
            month: date.month,
            day: date.day,
            student: `${session?.user.id} ${session?.user.name}`,
            music_url: playlistId,
          };
          const response = await axios.post(`api/data/wakeup/add`, data, {
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
          });
          toast.success('신청에 성공했습니다');
          router.push('/');
        } catch (error) {
          router.push('/error?error=wplaylist-error');
        }
      } else if (videodetails.length < 5 && songtype == 'wakeup') {
        toast.warning('기상송은 최소 5곡 이상 신청해야 합니다.');
      } else if (videodetails.length == 5 && songtype == 'labor') {
        await handleCreatePlaylist(false);
        try {
          const data = {
            year: date.year,
            month: date.month,
            day: date.day,
            student: `${session?.user.id} ${session?.user.name}`,
            music_url: playlistId,
          };
          setLoading(true);
          const response = await axios.post(`api/data/labor/add`, data, {
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
          });
          toast.success('신청에 성공했습니다');
          router.push('/');
        } catch (error) {
          router.push('/error?error=lplaylist-error');
        }
      } else if (
        (videodetails.length < 5 || videodetails.length > 5) &&
        songtype == 'labor'
      ) {
        toast.warning('노동요는 5곡을 신청해야 합니다.');
      }
    }
  };

  return (
    <main className="flex flex-col items-center w-full my-[80px]">
      <div className="flex flex-row justify-center w-full">
        <div>
          <div className="w-[350px] md:w-[500px] h-[80px] calendarExp mb-[10px] rounded-xl py-[15px] px-[20px] flex flex-col justify-center bg-body">
            <p className="text-xl font-bold text-cusblue-normal">
              원하는 노래의 주소 입력
            </p>
            <div className="flex">
              <p className="text-sm text-text">유튜브 주소만으로&nbsp;</p>
              <p className="text-sm text-cusblue-normal font-bold">{`${songtype == 'labor' ? '노동요' : '기상송'}`}</p>
              <p className="text-sm text-text">을 신청할 수 있습니다</p>
            </div>
            <div></div>
          </div>
          <div className="flex flex-row mb-[7px] w-full justify-end">
            <div className="px-[8px] h-[18px] text-xs text-white bg-cusblue-normal rounded-full text-center mr-[1px] shadow-2xl shadow-shadowc">
              {date.year}년&nbsp;{date.month}월&nbsp;{date.day}일
            </div>
          </div>
          <div
            className={`${inputhover ? 'inputbig pl-[5px]' : 'inputsmall pl-[10px]'} inputcontainer flex flex-col justify-start w-[500px] border border-input bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-cusblue-normal focus-within:ring-offset-0 shadow-2xl shadow-shadowc`}
          >
            <div className="flex flex-col justify-center h-[40px]">
              <input
                type="text"
                className="flex h-[40px] input border-0 focus:outline-none bg-transparent text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={inputvalue}
                onChange={handleInputChange}
                placeholder="유튜브 주소 입력"
              />
              <div
                className="hover-area flex justify-center items-center cursor-pointer"
                onMouseDown={() => renderclick(true)}
                onMouseUp={() => renderclick(false)}
              >
                <Icon
                  icon="uil:arrow-right"
                  className="text-white text-2xl"
                ></Icon>
              </div>
              <div
                className={`moving-element bg-cusblue-normal ${inputhover ? 'move-l' : 'move-r'} ${inputclicked ? 'scaled' : 'scaleu'}`}
              ></div>
            </div>
            <div className="flex justify-between items-center h-[40px]">
              <span
                className={`text-base ${videodetails.length < 5 ? 'text-red-700' : (songParams === 'labor' ? (videodetails.length > 5 ? 'text-red-700' : 'text-cusblue-normal') : 'text-cusblue-normal')}`}
              >
                {videodetails.length}/5
              </span>
              <button
                type="button"
                className="bg-cusblue-normal w-[60px] h-[25px] flex justify-center items-center rounded hover:bg-cusblue-deep transition duration-200 text-2xs font-semibold mr-[5px]"
                onClick={loading !== true ? () => submitmusic() : undefined}
              >
                <p className={`text-white ${!loading ? '' : 'hidden'}`}>
                  신청하기
                </p>
                <span
                  className={`loader w-[17px] aspect-square border-1 ${loading ? '' : 'hidden'}`}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center ${videodetails.length >= 1 ? '' : 'items-center'} min-h-[450px] w-[90%] my-[30px] rounded-lg`}
      >
        {videodetails.length >= 1 ? (
          <div className="musicscontainer grid grid-cols-4 gap-5">
            {videodetails.map((items, index) => {
              return (
                <div className="relative hover:scale-105 duration-150">
                  <a href={items.link}>
                    <div
                      className={`musiccontainer flex-col rounded-lg ${remove === index ? 'deleting' : ''}`}
                    >
                      <img
                        src={items.thumbnail}
                        alt={items.title}
                        className="thumbnailimg"
                      />
                      <div className="p-[10px] musictext items-center">
                        <span className="text-text text-xs">{items.title}</span>
                      </div>
                    </div>
                  </a>
                  <div
                    className={`absolute top-2 right-0 w-[24px] h-[24px] xicon z-10 ${remove === index ? 'deleting' : ''}`}
                    onClick={() => removemusic(index)}
                  >
                    <Icon icon="mdi:remove" className="" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold">🎧 여기에 노래가 표시됩니다</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitContent />
    </Suspense>
  );
}
