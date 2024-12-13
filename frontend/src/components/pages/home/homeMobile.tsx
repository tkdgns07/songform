'use client';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Dayinfo {
  id: number;
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
const MobilePage = () => {
  const router = useRouter();

  if(process.env.NEXTAUTH_URL == 'https://songchan.vercel.app'){router.push('/error?error=preparing')}

  const [wcalendarday, setwCalendar] = useState<Dayinfo[]>([]);
  const [nwcalendarday, setnwCalendar] = useState<Dayinfo[]>([]);
  const [lcalendarday, setlCalendar] = useState<Dayinfo[]>([]);
  const [nlcalendarday, setnlCalendar] = useState<Dayinfo[]>([]);

  const [clickedDay, setClickedDay] = useState<number>(-1);
  const { data: session, status } = useSession();
  const [choosemusic, setChoosemusic] = useState<boolean>(true);
  const [videoIds, setVideoIds] = useState<string[]>();
  const [playlistId, setPlaylistId] = useState<string>('');
  const [submitstudent, setSubmitstudent] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [videoInfo, setVideoinfo] = useState<Youtbeinfo[]>([]);
  const [curruntMonth, setCurruntMonth] = useState<boolean>(true);
  const [clickedSub, setClickedSub] = useState<number>(-1);
  const [canDrag, setCanDrag] = useState<boolean>(true);

  const now: Date = new Date();
  const year: number = now.getFullYear();
  const month: number = now.getMonth() + 1;
  const date: number = now.getDate();

  const fetchCalendarData = async () => {
    setLoading('data');
    try {
      const lresponse = await axios.get(`/api/data/labor/get`, {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });
      const ldata: Dayinfo[] = lresponse.data.data.sort(
        (a: Dayinfo, b: Dayinfo) => a.id - b.id,
      );

      const currunt_ldays = ldata.filter((item) => item.month === month);
      const next_ldays = ldata.filter((item) => item.month !== month);

      setlCalendar(currunt_ldays);
      setnlCalendar(next_ldays);

      const wresponse = await axios.get(`/api/data/wakeup/get`, {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
      });
      const wdata: Dayinfo[] = wresponse.data.data.sort(
        (a: Dayinfo, b: Dayinfo) => a.id - b.id,
      );

      const currunt_wdays = wdata.filter((item) => item.month === month);
      const next_wdays = wdata.filter((item) => item.month !== month);

      setwCalendar(currunt_wdays);
      setnwCalendar(next_wdays);
    } catch (error) {
      router.push('error?error=cant-cfetch-calendar');
    }
    setLoading('');
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
          },
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
          },
        });
        const data = response.data;
        if (clickedSub !== -1) {
          setVideoinfo(data);
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
        selectedclick(0);
        setClickedDay(id);
      }
    }
  };

  const hasSelectedClass = (id: number) => {
    if (id === clickedDay || id === clickedSub) {
      return 'border-none !bg-cusblue-normal !text-frame shadow-2xl shadow-cusblue-normal z-10 rounded';
    }
  };

  const submitClicked = async () => {
    let currentYear, currentMonth, currentDay;
    const calendar: Dayinfo[] = curruntMonth
      ? choosemusic
        ? wcalendarday
        : lcalendarday
      : choosemusic
        ? nwcalendarday
        : nlcalendarday;
    const found = calendar.some(
      (student) =>
        student.student === `${session?.user.id} ${session?.user.name}`,
    );
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
    if (clickedDay !== -1 && status === 'authenticated' && !found) {
      router.push(
        `/submit?date=${currentYear}.${currentMonth}.${currentDay}&song=${choosemusic ? 'wakeup' : 'labor'}`,
      );
    } else if (status !== 'authenticated') {
      toast.error('로그인 해주세요');
    } else if (!curruntMonth && date < 24 && !birthday) {
      toast.warning('다음달 신청은 24일 부터 가능합니다.');
    } else if (clickedDay === -1) {
      toast.error('날짜를 선택해 주세요');
    } else if (found) {
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
    if (id !== clickedSub && id !== 0) {
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
      setClickedDay(-1);
    } else {
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
            },
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

  let birthday: boolean = false;

  if (session?.user.birthday) {
    if (session?.user.birthday == 'NaN') {
    }

    const [firstPart, ...rest] = session?.user.birthday.split(' ');
    const secondPart = rest.join(' ');
    if (parseInt(secondPart) === month + 1) {
      birthday = true;
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  function getMonthName(monthNumber: number): string {
    if (monthNumber < 1 || monthNumber > 12) throw new Error("Invalid month number");
    return monthNames[monthNumber - 1];
  }

  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // ResizeObserver 생성
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.contentRect.height); // 요소의 높이를 업데이트\
        console.log(height)
      }
    });

    // 요소 관찰 시작
    resizeObserver.observe(element);

    return () => {
      // 관찰 중단
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <main className="w-full h-screen">
      <div className="mt-[50px] w-full flex flex-row mb-[40px] p-[10px]">
        <div
          className="w-full flex flex-col item-center"
        >
          <div className="w-full flex flex-row items-center">
            <div className='w-full flex flex-col justify-center'>
              <div className='fixed w-full top-0 mt-[50px]'
              ref={elementRef}>
              <div
                className="w-full flex justify-between"
              >
                {/* <div className="flex flex-row justify-between w-[70px]">
                  <button
                    className="w-[30px] h-[30px] bg-slate-300 rounded-lg flex justify-center items-center active:bg-slate-400 duration-150"
                    onClick={() => setMonth(true)}
                  >
                    <Icon icon="ep:arrow-up-bold" className="text-lg" />
                  </button>
                  <button
                    className="w-[30px] h-[30px] bg-slate-300 rounded-lg flex justify-center items-center active:bg-slate-400 duration-150"
                    onClick={() => setMonth(false)}
                  >
                    <Icon icon="ep:arrow-down-bold" className="text-lg" />
                  </button>
                </div> */}
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className={`flex justify-center items-center w-[50px] h-[30px] bg-red-500 rounded-lg mr-[5px] pointer ${clickedSub == -1 ? 'hidden' : session ? (`${session?.user.id} ${session?.user.name}` === (choosemusic ? (curruntMonth ? wcalendarday[clickedSub]['student'] : nwcalendarday[clickedSub]['student']) : curruntMonth ? lcalendarday[clickedSub]['student'] : nlcalendarday[clickedSub]['student']) ? '' : session.user.admin ? '' : 'hidden') : 'hidden'} hover:bg-red-700 duration-150`}
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
                  <div className="w-full h-[45px] bg-gray-200 flex justify-between items-center p-[2px] rounded-full mb-[10px]">
                    <div className='flex w-full h-full relative'>
                      <button
                        type="button"
                        className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                        onClick={() => switchmusic(true)}
                      >
                        기상송
                      </button>
                      <button
                        type="button"
                        className={`flex-1 text-base font-bold z-10 text-text trasnform duration-200`}
                        onClick={() => switchmusic(false)}
                      >
                        노동요
                      </button>
                      <div
                        className={`w-1/2 h-full bg-white shdow-xl rounded-full absolute transition-transform duration-300 ${choosemusic ? 'translate-x-0' : 'translate-x-full'}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full bg-white rounded-xl shadow-sm'>
                <div className='flex items-center justify-between p-[15px] mb-[10px]'>
                  <div>
                    <p className='text-2xl text-text font-bold'>{getMonthName(month)}</p>
                    <p className='text-lighttext text-sm'>{year}</p>
                  </div>
                  <div>
                    <button
                      className='flex justify-center items-center w-[30px] h-[30px] rounded-full bg-black'
                      onClick={() => submitClicked()}
                    >
                      <Icon
                        icon="uil:arrow-right"
                        className="text-white text-2xl"
                      ></Icon>
                    </button>
                  </div>
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
                <div className='w-full grid grid-cols-7'>
                  {curruntMonth
                    ? wcalendarday.map((item, index) => {
                        return (
                          <div
                            id={item.day.toString()}
                            className={`flex flex-col items-center justify-center aspect-[2/3]`}
                            onClick={() => dayClicked(index)}
                          >
                            <div className={`flex justify-center items-center mb-[1px] w-[30px] h-[30px] rounded-full ${index == clickedDay ? 'bg-text text-white' : (index == clickedSub ? 'bg-text text-white' : '')} text-sm duration-300 ${item.day == 0 ? 'text-white' : ''} ${item.day < date ? 'text-lighttext' : ''}`}>
                              {item.day}
                            </div>
                            <div className={`w-[20px] h-[3px] rounded-full bg-text ${item.day == date ? 'opacity-100' : 'opacity-0'}`}></div>
                            <div className={`w-[5px] h-[5px] rounded-full bg-text ${item.student == 'None' ? 'opacity-0' : 'opacity-0'}`}></div>
                          </div>
                        )
                      })
                    : nwcalendarday.map((item, index) => {
                        if (date >= 24 || (date >= 17 && birthday)) {
                          return (
                            <div></div>
                          );
                        } else {
                          return (
                            <div></div>
                          );
                        }
                    })}
                </div>
              </div>
              </div>
              {/* <div
                className="flex relative overflow-hidden"
              >
                <div
                  className={`absoulute duration-500 flex ${choosemusic ? 'goright' : 'goleft'}`}
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
                      <div
                        className={`grid grid-cols-7 ${loading === 'data' ? 'hidden' : ''}`}
                      >
                        {curruntMonth
                          ? wcalendarday.map((item, index) => {
                              return (
                                <div
                                  id={item.day.toString()}
                                  className={`day !border-none !h-[70px] flex justify-center items-center text-xs trasition duration-200 cursor-pointer`}
                                  onClick={
                                    item.student !== 'None'
                                      ? () => dayClicked(index)
                                      : undefined
                                  }
                                >
                                  <div
                                    className={`${hasSelectedClass(index)} rounded-full w-[25px] h-[25px] bg-gray-400 -z-50`}
                                  >
                                    {item.student === 'None' ? (
                                      <p
                                        className={`${item.day !== 0 ? (item.day == date ? 'text-text font-bold}' : '') : 'hidden'} z-10`}
                                      >
                                        {item.day}
                                      </p>
                                    ) : (
                                      <div className="rounded-full bg-cusblue-normal w-[15px] h-[15px] flex justify-center items-center z-10">
                                        <p
                                          className={`${item.day !== 0 ? (item.day == date ? 'text-text font-bold}' : '') : 'hidden'} text-white`}
                                        >
                                          {item.day}
                                        </p>
                                      </div>
                                    )}
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
                      <Skeleton
                        className={`w-[10px] h-[500px] ${loading === 'data' ? '' : 'hidden'}`}
                      />
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
                      <div
                        className="grid grid-cols-7"
                      >
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
                                    <div
                                      className={`flex justify-center item-center rounded-xl w-[62px] h-[15px] ml-[2px] mt-[1px] text-2xs ${clickedSub === index ? 'bg-white text-cusblue-normal' : 'bg-cusblue-normal text-white'}`}
                                    >
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
                                      <div
                                        className={`flex justify-center item-center rounded-xl w-[62px] h-[15px] ml-[2px] mt-[1px] text-2xs ${clickedSub === index ? 'bg-white text-cusblue-normal' : 'bg-cusblue-normal text-white'}`}
                                      >
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
              </div> */}
            <div className='w-1 bg-white'
            style={{ height: `${height}px` }}></div>
            <div className="flex flex-col items-center w-screen h-screen rounded-t-xl bg-white mt-[10px] pt-[10px] overflow-y-auto scroll-m-10 z-50">
              <div className="w-[50px] h-[5px] rounded-full bg-lighttext cursor-pointer"></div>

              <div className="w-full flex justify-start mt-[10px] px-[30px]">
                <p className="text-xl font-bold">TODAY</p>
              </div>

                <div className="w-full px-[30px]">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MobilePage;
