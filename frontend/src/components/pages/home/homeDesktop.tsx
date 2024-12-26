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
  id: number;
  year: number;
  month: number;
  day: number;
  student: string;
  music_url: string;
  disabled: boolean;
}

interface Youtbeinfo {
  thumbnail: string;
  title: string;
  link: string;
}

const DesktopPage = () => {
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
      return 'border-none !text-frame shadow-2xl shadow-cusblue-normal z-10 rounded bg-gradient-to-br from-cusblue-normal to-cusblue-light scale-105 overflow-visible';
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
    if (parseInt(secondPart) === (month == 12 ? 1 : month + 1)) {
      birthday = true;
    }
  }

  function isWeekend(start: number, date: number): boolean {
    const dayIndex = (start + date - 1) % 7;
    return dayIndex === 0 || dayIndex === 6;
  }

  return (
    <main className="my-[80px]">
      <div className="flex flex-row">
        <div>
          <div className="border-2 border-cusblue-normal bg-body w-[1060px] h-[80px] mb-[10px] rounded-xl py-[15px] px-[20px] flex flex-row justify-between items-center relative -z-10 overflow-hidden shadow-2xl shadow-shadowc">
            <div>
              <p className="text-xl font-bold text-cusblue-deep">
                노래 신청 시스템
              </p>
              <p className="text-sm text-cusblue-deep">
                기상송과 노동요를 다운로드 없이 편하게 신청해보세요
              </p>
            </div>
            <div
              className={`flex flex-col justify-center items-end ${birthday ? '' : 'hidden'}`}
            >
              <p className="text-lg font-bold">🥳 다음달엔 내 생일~</p>
              <p className="text-sm">
                다음달 곡 신청을 예정보다 일주일 빨리 신청할 수 있습니다!
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <div>
              <div className="flex justify-between">
                <div className="flex flex-row justify-between w-[70px]">
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
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className={`flex justify-center items-center p-[10px] h-[30px] bg-black rounded-lg mr-[5px] pointer relative ${clickedSub == -1 ? 'hidden' : session ? (`${session?.user.id} ${session?.user.name}` === (choosemusic ? (curruntMonth ? wcalendarday[clickedSub]['student'] : nwcalendarday[clickedSub]['student']) : curruntMonth ? lcalendarday[clickedSub]['student'] : nlcalendarday[clickedSub]['student']) ? '' : session.user.admin ? '' : 'hidden') : 'hidden'} duration-150 shadow-2xl shadow-shadowc`}
                    onClick={
                      loading !== 'deleting'
                        ? () => deletePlaylist()
                        : undefined
                    }
                  >
                    <span
                      className={`loader w-[17px] aspect-square border-1 ${loading == 'deleting' ? '' : 'hidden'}`}
                    ></span>
                    <Icon
                      icon="mdi:remove"
                      className={`text-body m-0 p-0 ${loading !== 'deleting' ? '' : 'hidden'}`}
                    />
                    <p
                      className={`text-body text-sm ${loading !== 'deleting' ? '' : 'hidden'}`}
                    >
                      삭제
                    </p>
                  </button>
                  <div className="w-[120px] h-[30px] bg-white flex justify-between items-center p-[8px] rounded-lg relative mb-[10px] shadow-2xl shadow-shadowc">
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
              <div className="flex w-[800px] relative shadow-2xl rounded-lg shadow-shadowc overflow-x-hidden">
                <div
                  className={`absoulute duration-500 flex w-[1650px] ${choosemusic ? 'goright' : 'goleft'}`}
                >
                  <div className="left-0 w-[800px] bg-white rounded-lg">
                    <div className="flex flex-row justify-between items-center p-[12px]">
                      <div className="flex flex-row items-center">
                        <span className="text-lighttext text-sm fontsemibold mr-[5px]">
                          {curruntMonth ? year : (month === 12 ? year + 1 : year)}
                        </span>
                        <span className="text-text text-base font-bold">{`${curruntMonth ? month : (month === 12 ? 1 : month + 1)}월`}</span>
                      </div>
                      <button
                        type="button"
                        className="bg-cusblue-normal text-white px-3 py-1.5 rounded hover:bg-cusblue-deep transition duration-200 text-xs font-semibold !m-[0]"
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
                                  className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.day === 0 ? '!disable' : ''} ${hasSelectedClass(index)}`}
                                  onClick={
                                    item.student !== 'None'
                                      ? () => selectedclick(index)
                                      : () => dayClicked(index)
                                  }
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
                          : nwcalendarday.map((item, index) => {
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
                      <Skeleton
                        className={`w-full h-[500px] ${loading === 'data' ? '' : 'hidden'}`}
                      />
                    </div>
                  </div>
                  <div className="right-0 ml-[50px] w-[800px] bg-white rounded-lg">
                    <div className="flex flex-row justify-between items-center p-[12px]">
                      <div className="flex flex-row items-center">
                        <span className="text-lighttext text-sm fontsemibold mr-[5px]">
                          {curruntMonth ? year : (month === 12 ? year + 1 : year)}
                        </span>
                        <span className="text-text text-base font-bold">{`${curruntMonth ? month : (month === 12 ? 1 : month + 1)}월`}</span>
                      </div>
                      <button
                        type="button"
                        className="bg-cusblue-normal text-white px-3 py-1.5 rounded hover:bg-cusblue-deep transition duration-200 text-xs font-semibold !m-[0]"
                        onClick={() => submitClicked()}
                      >
                        신청하기
                      </button>
                    </div>
                    <div className="h-[1px] w-[100%] bg-frame"></div>
                    <div className="p-[0] relative">
                      <span className='absolute w-[800px] h-full top-0 left-0 z-50 opacity-50 blurfillter flex justify-center items-center'>
                        <p className='font-bold text-black'>노동요 신청은 아직 신청 불가합니다.</p>
                      </span>
                      <div className="grid grid-cols-7">
                        <span className="day-name text-red-600">S</span>
                        <span className="day-name">M</span>
                        <span className="day-name">T</span>
                        <span className="day-name">W</span>
                        <span className="day-name">T</span>
                        <span className="day-name">F</span>
                        <span className="day-name text-blue-600">S</span>
                      </div>
                      <div className="grid grid-cols-7">
                        {curruntMonth
                          ? lcalendarday.map((item, index) => {
                              return (
                                <div
                                  id={item.day.toString()}
                                  className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.disabled ? '!disable pointer-events-none' : ''} ${hasSelectedClass(index)}`}
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
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame md:hover:text-cusblue-normal trasition duration-200 cursor-pointer ${item.disabled ? '!disable pointer-events-none' : ''} ${hasSelectedClass(index)}`}
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
                                    className={`day flex flex-col md:flex-row text-xs md:hover:bg-frame trasition duration-200 cursor-pointer ${item.disabled ? '!disable pointer-events-none' : ''}`}
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
                      <Skeleton
                        className={`w-full h-[500px] ${loading === 'data' ? '' : 'hidden'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[250px] h-[620px] bg-white rounded-xl py-[15px] px-[20px] flex flex-col justify-start ml-[10px] relative shadow-2xl shadow-shadowc">
              <div className="flex flex-row justify-start items-center mb-[10px] ml-[5px]">
                <a
                  href={`https://www.youtube.com/playlist?list=${playlistId}`}
                  className={`mr-[5px] ${playlistId ? '' : 'pointer-events-none'}`}
                >
                  <Icon
                    icon="mdi:youtube"
                    className={`text-3xl ${playlistId ? 'text-red-600' : 'text-text'} duration-150`}
                  />
                </a>
                <p className="text-lg font-bold text-text">노래 미리보기</p>
              </div>
              <div className="w-full bg-gray-300 h-[1px] mb-[10px]"></div>
              <div className="w-full max-h-full overflow-y-auto">
                {Array.isArray(videoInfo) &&
                  videoInfo.map((item) => {
                    return (
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
                    );
                  })}
              </div>
              <div
                className={`h-full w-full flex items-center justify-center p-[5px] ${submitstudent !== '' ? 'hidden' : ''}`}
              >
                <p className="text-text">신청된 날짜를 클릭해보세요</p>
              </div>
              <div
                className={`w-full h-full flex items-center justify-center ${loading == 'listloading' ? '' : 'hidden'} absolute loadcontain`}
              >
                <span className="loader w-[48px] aspect-square !border-4"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DesktopPage;
