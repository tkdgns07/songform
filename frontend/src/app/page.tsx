'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import DesktopPage from '@/components/pages/home/homeDesktop';
import MobilePage from '@/components/pages/home/homeMobile';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  if (windowWidth !== 0) {
    return (
      <>{isMobile ? <MobilePage width={windowWidth} /> : <DesktopPage />}</>
    );
  }
}
