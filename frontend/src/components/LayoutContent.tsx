'use client';
import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { format } from 'date-fns';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import LoginButton from '@/components/LoginButton';
import Footbar from './content/Footbar';

import Image from 'next/image';
import schoollogo from '@/img/schoollogo.png';

import '@/app/globals.css';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const { data: session } = useSession();
  const [date, setDate] = useState<Date>();
  const [loader, setLoader] = useState<string>('');
  const router = useRouter();

  const today = new Date();
  let year = today.getFullYear();
  const month = today.getMonth() + 1;
  const ndate = today.getDate();

  if (session?.user.id) {
    const grade = session.user.id.toString()[0];
    if (grade === '3') {
      year = today.getFullYear() - 18;
    } else if (grade === '2') {
      year = today.getFullYear() - 17;
    } else if (grade === '1') {
      year = today.getFullYear() - 16;
    }
  }

  let isBirthday = true;

  if (
    session &&
    !session.user.admin &&
    (!session?.user?.birthday || session.user.birthday === 'NaN')
  ) {
    isBirthday = false;
  }

  async function updateNewBirthday() {
    if (!date || !inputRef.current?.value) {
      toast.warning('이름 또는 생일을 모두 입력해주세요.');
      return;
    }

    setLoader('date submitting');

    const newDate = `${date.getDate()} ${date.getMonth() + 1}`;

    try {
      const response = await axios.post('api/data/student/add', {
        id: session?.user.id,
        birthday: newDate,
        name: inputRef.current.value,
      });

      signOut();
      setLoader('');
    } catch (error) {
      setLoader('');
      router.push('/error?error=student-add-error');
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  if (windowWidth !== 0) {
    return (
      <>
        {isMobile ? (
          <>
            <div
              className={`flex justify-center items-center fixed w-screen h-screen bg-black/50 z-50 ${
                isBirthday ? 'hidden' : ''
              }`}
            >
              <div className="flex flex-col justify-center bg-white border border-gray-300 w-[400px] h-[250px] rounded-lg p-[30px]">
                <div>
                  <p className="text-2xl font-bold">생일을 입력해주세요</p>
                  <p className="text-xs text-gray-600 mt-[5px]">
                    생일 날짜가 입력되지 않아 원활한 서비스가 제공되지 않을 수
                    있습니다.
                  </p>
                </div>
                <div className="w-full mt-[20px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon />
                        {date ? (
                          format(date, 'PPP')
                        ) : (
                          <span>날짜를 선택하세요</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => {
                          if (day) setDate(day);
                        }}
                        initialFocus
                        defaultMonth={new Date(year, month, ndate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end">
                  <button
                    className="flex items-center justify-center mt-[20px] w-[90px] h-[40px] border-none bg-cusblue-normal rounded-lg hover:bg-cusblue-deep duration-150"
                    onClick={() => updateNewBirthday()}
                  >
                    <p
                      className={`text-sm text-white ${
                        loader !== 'date submitting' ? '' : 'hidden'
                      }`}
                    >
                      제출
                    </p>
                    <span
                      className={`loader w-[17px] aspect-square border-1 ${
                        loader === 'date submitting' ? '' : 'hidden'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-[10px] w-[100%] h-[40px] flex items-center justify-between menubar">
              <LoginButton />
            </div>
            <div className="w-full flex justify-center">
              {children}
              <Analytics />
              <SpeedInsights />
            </div>
            <Toaster />
          </>
        ) : (
          <>
            <div
              className={`flex justify-center items-center fixed w-screen h-screen bg-black/50 z-50 ${
                isBirthday ? 'hidden' : ''
              }`}
            >
              <div className="flex flex-col justify-center bg-white border border-gray-300 w-[400px] rounded-lg p-[30px]">
                <div>
                  <p className="text-2xl font-bold">
                    사용자 정보를 입력해주세요
                  </p>
                  <p className="text-xs text-gray-600 mt-[5px]">
                    이름과 생일 날짜를 입력해주세요.
                  </p>
                </div>
                <div className="w-full mt-[20px]">
                  <span className="text font-bold">학번 & 이름</span>
                  <Button
                    variant={'outline'}
                    className="w-full justify-start text-left font-normal mb-[10px] flex"
                    onClick={handleFocus}
                  >
                    <span>{session?.user.id} </span>
                    <input
                      ref={inputRef}
                      type="text"
                      className="bg-transparent outline-none cursor-pointer"
                      defaultValue={session?.user.name ?? ''}
                    />
                  </Button>

                  <span className="text font-bold">생일</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon />
                        {date ? (
                          format(date, 'PPP')
                        ) : (
                          <span>날짜를 선택하세요</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => {
                          if (day) setDate(day);
                        }}
                        initialFocus
                        defaultMonth={new Date(year, month - 1, ndate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end">
                  <button
                    className="flex items-center justify-center mt-[20px] w-[90px] h-[40px] border-none bg-cusblue-normal rounded-lg hover:bg-cusblue-deep duration-150"
                    onClick={() => updateNewBirthday()}
                  >
                    <p
                      className={`text-sm text-white ${
                        loader !== 'date submitting' ? '' : 'hidden'
                      }`}
                    >
                      제출
                    </p>
                    <span
                      className={`loader w-[17px] aspect-square border-1 ${
                        loader === 'date submitting' ? '' : 'hidden'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-[20px] w-[100%] h-[70px] flex items-center justify-between mb-[10px] menubar">
              <Link
                href={{ pathname: '/' }}
                className="ml-[0px] h-[90%] flex direction-col items-center"
              >
                <Image src={schoollogo} alt="KSHS_logo" className="w-[35px]" />
                <p className="menutext text-base ml-[5px]">강원과학고등학교</p>
                <div className="w-[1.5px] h-[1.3em] bar m-[5px]"></div>
                <p className="menutext text-base">KSHS</p>
              </Link>
              <LoginButton />
            </div>
            <div className="w-full flex-cols justify-center">
              {children}
              <Analytics />
              <SpeedInsights />
              <Footbar />
            </div>
            <Toaster />
          </>
        )}
      </>
    );
  }
};

export default LayoutContent;
