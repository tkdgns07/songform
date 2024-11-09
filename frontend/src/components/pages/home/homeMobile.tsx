'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Dayinfo {
  id: number
  year: number;
  month: number;
  day: number;
  student: string;
  music_url: string;
}

interface Youtbeinfo {
  thumbnail: string;
  title: string;
  link: string;
}

interface MobilePageProps {
    width: number;
}

const MobilePage = ({ width }: MobilePageProps) => {
  const [wcalendarday, setwCalendar] = useState<Dayinfo[]>([]);
  const [nwcalendarday, setnwCalendar] = useState<Dayinfo[]>([]);
  const [lcalendarday, setlCalendar] = useState<Dayinfo[]>([]);
  const [nlcalendarday, setnlCalendar] = useState<Dayinfo[]>([]);

  const [clickedDay, setClickedDay] = useState<number>(-1);
  const { data: session, status } = useSession();
  const [choosemusic, setChoosemusic] = useState<boolean>(true);
  const router = useRouter();
  const [videoIds, setVideoIds] = useState<string[]>();
  const [playlistId, setPlaylistId] = useState<string>('');
  const [submitstudent, setSubmitstudent] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [videoInfo, setVideoinfo] = useState<Youtbeinfo[]>([]);
  const [curruntMonth, setCurruntMonth] = useState<boolean>(true);
  const [clickedSub, setClickedSub] = useState<number>(-1);

  const [windowWidth, setWindowWidth] = useState<number>(450);

  router.push('error?error=preparing')

  useEffect(() => {
    console.log(width)
    if(width !== 0){
        setWindowWidth(width);
        console.log(windowWidth)
    }
  }, [width]);

  const now: Date = new Date();
  const year: number = now.getFullYear();
  const month: number = now.getMonth() + 1;
  const date: number = now.getDate();
  
  const fetchCalendarData = async () => {
    setLoading('data')
    try {
      const wresponse = await axios.get(
        `/api/data/wakeup/get`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          }
        }
      );
      const wdata: Dayinfo[] = wresponse.data.data.sort((a: Dayinfo, b: Dayinfo) => a.id - b.id);

      const currunt_wdays = wdata.filter((item) => item.month === month);
      const next_wdays = wdata.filter((item) => item.month !== month);

      setwCalendar(currunt_wdays);
      setnwCalendar(next_wdays);

      const lresponse = await axios.get(
        `/api/data/labor/get`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          }
        }
      );
      const ldata: Dayinfo[] = lresponse.data.data.sort((a: Dayinfo, b: Dayinfo) => a.id - b.id);

      const currunt_ldays = ldata.filter((item) => item.month === month);
      const next_ldays = ldata.filter((item) => item.month !== month);

      setlCalendar(currunt_ldays);
      setnlCalendar(next_ldays);
    } catch (error) {
      router.push('error?error=cant-cfetch-calendar');
    }
    setLoading('')
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  useEffect(() => {
    if (!playlistId) return;

    const fetchVideoIds = async () => {
      try {
        setLoading('listloading');
        const response = await axios.get(`/api/getlist`, {
          params: {
            playlistId: playlistId,
          },
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          }
        });

        setVideoIds(response.data.videoIds);
        setLoading('');
      } catch (error) {
        toast.error('다시 시도해 보세요.');
      }
    };

    fetchVideoIds();
  }, [playlistId]);

  useEffect(() => {
    if (!videoIds) return;
    const fetchVideoinfo = async () => {
      try {
        const response = await axios.get(`/api/youtubeinfo`, {
          params: {
            videoUrl: videoIds, // 여러 URL을 배열로 전달할 수 있습니다.
          },
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          }
        });
        const data = response.data;
        if (clickedSub !== -1) {
          setVideoinfo(data)
        }
      } catch (error) {
        toast.error('다시 시도해 보세요.');
      }
    };
    fetchVideoinfo();
  }, [videoIds]);

  const dayClicked = (id: number) => {
    const { day: day, student: student } = curruntMonth
      ? choosemusic
        ? wcalendarday[id]
        : lcalendarday[id]
      : choosemusic
        ? nwcalendarday[id]
        : nlcalendarday[id];
    if (day !== 0 && student === 'None') {
      if (id === clickedDay) {
        setClickedDay(-1);
      } else if (wcalendarday[id]['day'] >= date || !curruntMonth) {
        setClickedDay(id);
      }
    } else if (day !== 0 && student !== 'None') {
      if (id !== clickedSub) {
        selectedclick(id);
      }else {
        selectedclick(0);
      }
    }
  };

  const hasSelectedClass = (id: number) => {
    return id === clickedDay ? '' : 'opacity-10';
  };

  const submitClicked = async () => {
    let currentYear, currentMonth, currentDay;
    const calendar : Dayinfo[] = curruntMonth ? (choosemusic ? wcalendarday : lcalendarday) : (choosemusic ? nwcalendarday : nlcalendarday)
    const found = calendar.some(student => student.student === `${session?.user.id} ${session?.user.name}`);
    if (clickedDay !== -1 && !found) {
      if (curruntMonth) {
        ({
          year: currentYear,
          month: currentMonth,
          day: currentDay,
        } = wcalendarday[clickedDay]);
      } else {
        ({
          year: currentYear,
          month: currentMonth,
          day: currentDay,
        } = nwcalendarday[clickedDay]);
      }
    }
    if (clickedDay !== -1 && (status === 'authenticated'&& !found)) {
      router.push(
        `/submit?date=${currentYear}.${currentMonth}.${currentDay}&song=${choosemusic ? 'wakeup' : 'labor'}`,
      );
    } else if (status !== 'authenticated') {
      toast.error('로그인 해주세요');
    } else if (!curruntMonth && (date < 24 && !birthday)) {
      toast.warning('다음달 신청은 24일 부터 가능합니다.');
    } else if (clickedDay === -1) {
      toast.error('날짜를 선택해 주세요');
    } else if (found){
      toast.warning('이미 신청했습니다.');
    }
  };

  const switchmusic = (music: boolean) => {
    setClickedDay(-1);
    setPlaylistId('');
    setSubmitstudent('');
    setClickedSub(-1);
    setChoosemusic(music);
    setVideoinfo([]);
  };

  const selectedclick = (id: number) => {
    if (id !== 0) {
      const { student, music_url } = choosemusic
      ? curruntMonth
        ? wcalendarday[id]
        : nwcalendarday[id]
      : curruntMonth
        ? lcalendarday[id]
        : nlcalendarday[id];
      setPlaylistId(music_url);
      setSubmitstudent(student);
      setClickedSub(id);
    }else {
      setPlaylistId('');
      setSubmitstudent('');
      setClickedSub(-1);
      setVideoinfo([]);
    }
  };

  const setMonth = (status: boolean) => {
    if (status !== curruntMonth) {
      setClickedDay(-1);
      setCurruntMonth(status);
    }
  };

  const deletePlaylist = async () => {
    setLoading('deleting');
    try {
      const response = await axios.delete(`/api/deletelist`, {
        data: {
          playlistId: playlistId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (response.status === 200) {
        try {
          let currentYear, currentMonth, currentDay;
          if (curruntMonth) {
            ({
              year: currentYear,
              month: currentMonth,
              day: currentDay,
            } = wcalendarday[clickedSub]);
          } else {
            ({
              year: currentYear,
              month: currentMonth,
              day: currentDay,
            } = nwcalendarday[clickedSub]);
          }
          const url = `/api/data/${choosemusic ? 'wakeup' : 'labor'}/delete`;
          const response_deleting = await axios.post(
            url,
            {
              year: currentYear,
              month: currentMonth,
              day: currentDay,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.CRON_SECRET}`,
              },
            }
          );

          if (
            response_deleting.status === 200 ||
            response_deleting.status === 204
          ) {
            toast.success('성공적으로 제거되었습니다.');
            fetchCalendarData();
            setClickedSub(-1);
            setVideoinfo([]);
            setPlaylistId('');
          }
        } catch (error) {
          toast.error('삭제중 오류가 발생했습니다.');
        }
      } else {
        toast.error('삭제중 오류가 발생했습니다.');
      }
    } catch (error) {
      toast.error('삭제중 오류가 발생했습니다.');
    }
    setLoading('');
  };
  
  let birthday : boolean = false;

  if (session?.user.birthday){
    const [firstPart, ...rest] = session?.user.birthday.split(' ')
    const secondPart = rest.join(' ');
    if (parseInt(secondPart) === (month + 1)){
      birthday = true
    }
  }

  return (
    <main className=''>
      <div className="flex flex-row mb-[40px] p-[10px]">
        <div className='flex flex-col item-center'  style={{ width : `${windowWidth - 20}px`}}>
          <div className="h-[80px] calendarExp mb-[10px] rounded-xl py-[15px] px-[20px] flex flex-row justify-between items-center">
            <div>
              <p className="text-xl font-bold text-cusblue-deep">
                노래 신청 시스템
              </p>
              <p className="text-sm text-text">
                기상송과 노동요를 다운로드 없이 편하게 신청해보세요
              </p>
            </div>
            <div className={`flex flex-col justify-center items-end ${birthday ? '' : 'hidden'}`}>
              <p className='text-lg font-bold'>
                🥳 다음달엔 내 생일~
              </p>
              <p className='text-sm'>
                다음달 곡 신청을 예정보다 일주일 빨리 신청할 수 있습니다!
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div>
              <div className="flex justify-between" style={{ width : `${windowWidth - 20}px`}}>
                <div className="flex flex-row justify-between w-[70px]">
                  <button 
                    className="w-[30px] h-[30px] bg-slate-300 rounded-lg flex justify-center items-center active:bg-slate-400 duration-150"
                    onClick={() => setMonth(true)}
                  >
                    <Icon
                      icon="ep:arrow-up-bold"
                      className="text-lg"
                    />
                  </button>
                  <button 
                    className="w-[30px] h-[30px] bg-slate-300 rounded-lg flex justify-center items-center active:bg-slate-400 duration-150"
                    onClick={() => setMonth(false)}
                  >
                    <Icon
                      icon="ep:arrow-down-bold"
                      className="text-lg"
                    />
                  </button>
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className={`flex justify-center items-center w-[50px] h-[30px] bg-red-500 rounded-lg mr-[5px] pointer ${clickedSub == -1 ? 'hidden' : (session ? (`${session?.user.id} ${session?.user.name}` === (choosemusic ? curruntMonth ? wcalendarday[clickedSub]['student'] : nwcalendarday[clickedSub]['student'] : curruntMonth ? lcalendarday[clickedSub]['student'] : nlcalendarday[clickedSub]['student']) ? '' : (session.user.admin ? '' : 'hidden')) : 'hidden')} hover:bg-red-700 duration-150`}
                    onClick={() => deletePlaylist()}
                  >
                    <span
                      className={`loader w-[17px] aspect-square border-1 ${loading == 'deleting' ? '' : 'hidden'}`}
                    ></span>
                    <p
                      className={`text-white text-sm ${loading !== 'deleting' ? '' : 'hidden'}`}
                    >
                      삭제
                    </p>
                  </button>
                  <div className="w-[120px] h-[30px] bg-white flex justify-between items-center p-[8px] rounded-lg relative mb-[10px]">
                    <button
                      type="button"
                      className={`text-xs z-10 ml-[8px] ${choosemusic ? 'text-frame' : 'text-cusblue-normal'} trasnform duration-200`}
                      onClick={() => switchmusic(true)}
                    >
                      기상송
                    </button>
                    <button
                      type="button"
                      className={`text-xs z-10 mr-[8px] ${!choosemusic ? 'text-frame' : 'text-cusblue-normal'} trasnform duration-200`}
                      onClick={() => switchmusic(false)}
                    >
                      노동요
                    </button>
                    <div
                      className={`switcher ${choosemusic ? 'switchtrue' : 'switchfalse'}`}
                    ></div>
                  </div>
                </div>
              </div>
              <div
                className="flex relative overflow-hidden"
                style={{ width: `${windowWidth}px` }}
                >
                <div
                  className={`absoulute duration-500 flex ${choosemusic ? 'goright' : 'goleft'}`}
                  style={{ width: `${windowWidth * 2 + 50}px` }}
                >
                  <div className="left-0 w-full overflow-hidden bg-body rounded-lg shadow-lg">
                    <div className="flex flex-row justify-between items-center p-[12px]">
                      <div className="flex flex-row items-center">
                        <span className="text-lighttext text-sm fontsemibold mr-[5px]">
                          {year}
                        </span>
                        <span className="text-text text-base font-bold">{`${curruntMonth ? month : month + 1}월`}</span>
                      </div>
                      <button
                        type="button"
                        className="bg-button-noacti text-white px-3 py-1.5 rounded hover:bg-button-acti transition duration-200 text-xs font-semibold !m-[0]"
                        onClick={() => submitClicked()}
                      >
                        신청하기
                      </button>
                    </div>
                    <div className="h-[1px] w-[100%] bg-frame"></div>
                    <div className="p-[0]">
                      <div className="grid grid-cols-7">
                        <span className="day-name text-red-600">S</span>
                        <span className="day-name">M</span>
                        <span className="day-name">T</span>
                        <span className="day-name">W</span>
                        <span className="day-name">T</span>
                        <span className="day-name">F</span>
                        <span className="day-name text-blue-600">S</span>
                      </div>
                      <div className={`grid grid-cols-7 ${loading === 'data' ? 'hidden' : ''}`} style={{ width: `${windowWidth - 20}px` }}>
                        {curruntMonth
                          ? wcalendarday.map((item, index) => {
                              return (
                                <div
                                  id={item.day.toString()}
                                  className={`day !border-none !h-[70px] flex justify-center items-center text-xs trasition duration-200 cursor-pointer`}
                                  onClick={item.student !== 'None' ? () => dayClicked(index) : undefined}
                                >
                                <div className={`${hasSelectedClass(index)} rounded-full w-[25px] h-[25px] bg-gray-400 -z-50`}>
                                {item.student === 'None' ? (
                                    <p className={`${item.day !== 0 ? (item.day == date ? 'text-text font-bold}' : '') : 'hidden'} z-10`}>
                                    {item.day}
                                    </p>
                                ) : (
                                    <div className='rounded-full bg-cusblue-normal w-[15px] h-[15px] flex justify-center items-center z-10'>
                                    <p className={`${item.day !== 0 ? (item.day == date ? 'text-text font-bold}' : '') : 'hidden'} text-white`}>
                                    {item.day}
                                    </p>
                                    </div>
                                )
                            }
                            </div>
                                </div>
                              );  
                        })
                          : nwcalendarday.map((item, index) => {
                              if (date >= 24 || (date >= 17 && birthday)) {
                                return (
                                  <div
                                    id={item.day.toString()}
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''} ${hasSelectedClass(index)}`}
                                    onClick={() => dayClicked(index)}
                                  >
                                    {item.day !== 0 ? <p>{item.day}</p> : null}
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    id={item.day.toString()}
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''}`}
                                  >
                                    {item.day !== 0 ? <p>{item.day}</p> : null}
                                  </div>
                                );
                              }
                            })}
                      </div>
                      <Skeleton className={`w-[10px] h-[500px] ${loading === 'data' ? '' : 'hidden'}`}/>
                    </div>
                  </div>
                  <div className="right-0 ml-[50px] w-full shadow-sm overflow-hidden bg-white rounded-lg">
                    <div className="flex flex-row justify-between items-center p-[12px]">
                      <div className="flex flex-row items-center">
                        <span className="text-lighttext text-sm fontsemibold mr-[5px]">
                          {year}
                        </span>
                        <span className="text-text text-base font-bold">{`${curruntMonth ? month : month + 1}월`}</span>
                      </div>
                      <button
                        type="button"
                        className="bg-button-noacti text-white px-3 py-1.5 rounded hover:bg-button-acti transition duration-200 text-xs font-semibold !m-[0]"
                        onClick={() => submitClicked()}
                      >
                        신청하기
                      </button>
                    </div>
                    <div className="h-[1px] w-[100%] bg-frame"></div>
                    <div className="p-[0] flex justify-center">
                      <div className="grid grid-cols-7">
                        <span className="day-name text-red-600">S</span>
                        <span className="day-name">M</span>
                        <span className="day-name">T</span>
                        <span className="day-name">W</span>
                        <span className="day-name">T</span>
                        <span className="day-name">F</span>
                        <span className="day-name text-blue-600">S</span>
                      </div>
                      <div className="grid grid-cols-7" style={{ width: `${windowWidth - 20}px` }}>
                        {curruntMonth
                          ? lcalendarday.map((item, index) => {
                              return (
                                <div
                                  id={item.day.toString()}
                                  className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''} ${hasSelectedClass(index)}`}
                                  onClick={() => dayClicked(index)}
                                >
                                  {item.day !== 0 ? (
                                    item.day === date ? (
                                      <p className="text-text font-bold">
                                        {item.day}
                                      </p>
                                    ) : (
                                      <p>{item.day}</p>
                                    )
                                  ) : null}
                                  {item.student !== 'None' ? (
                                    <div className={`flex justify-center item-center rounded-xl w-[62px] h-[15px] ml-[2px] mt-[1px] text-2xs ${clickedSub === index ? 'bg-white text-cusblue-normal' : 'bg-cusblue-normal text-white'}`}>
                                      {item.student}
                                    </div>
                                ) : (
                                    ''
                                  )}
                                </div>
                              );
                            })
                          : nlcalendarday.map((item, index) => {
                              if (date >= 24 || (date >= 17 && birthday)) {
                                return (
                                  <div
                                    id={item.day.toString()}
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''} ${hasSelectedClass(index)}`}
                                    onClick={() => dayClicked(index)}
                                  >
                                    {item.day !== 0 ? <p>{item.day}</p> : null}
                                    {item.student !== 'None' ? (
                                      <div className={`flex justify-center item-center rounded-xl w-[62px] h-[15px] ml-[2px] mt-[1px] text-2xs ${clickedSub === index ? 'bg-white text-cusblue-normal' : 'bg-cusblue-normal text-white'}`}>
                                        {item.student}
                                      </div>
                                  ) : (
                                      ''
                                    )}
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    id={item.day.toString()}
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''}`}
                                  >
                                    {item.day !== 0 ? <p>{item.day}</p> : null}
                                    {item.student !== 'None' ? (
                                      <div className="flex justify-center item-center bg-cusblue-normal rounded-xl w-[62px] h-[15px] ml-[2px] mt-[1px] text-2xs text-frame">
                                        {item.student}
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                );
                              }
                            })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>
        </div>
      </div>
    </main>
  );
}


export default MobilePage;