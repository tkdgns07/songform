import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import schoollogo from './img/schoollogo.png';
import Link from 'next/link';
import SessionProvider from '@/components/SessionProvider';
import LoginButton from '@/components/LoginButton';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '기상찬',
  description: '강원과학고등학교 노래 신청폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="kr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
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
            <LoginButton/>
          </div>
          <div className="mt-[65px] w-full flex justify-center">{children}<Analytics /></div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
