'use client';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Image from 'next/image';
import schoollogo from '@/img/schoollogo.png';
import Link from 'next/link';
import LoginButton from '@/components/LoginButton';
import '@/app/globals.css';

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  let isBirthday = true;

  if (session?.user?.birthday === 'NaN') {
    isBirthday = false;
  }

  return (
    <>
      <div
        className={`fixed w-screen h-screen brightness-50 opacity-50 bg-black z-50 ${
          isBirthday ? 'hidden' : ''
        }`}
      ></div>
      <div className="p-[10px] w-[100%] h-[55px] flex items-center justify-between mb-[10px] menubar">
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
      <div className="w-full flex justify-center">
        {children}
        <Analytics />
        <SpeedInsights />
      </div>
      <Toaster />
    </>
  );
};

export default LayoutContent;
