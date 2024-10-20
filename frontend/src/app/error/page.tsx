'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import errorimg from '../img/error404.png';
import Image from "next/image";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className='flex flex-col justify-center'>
      <p className='text-3xl text-center font-bold'>{error}</p>
      <Image src={errorimg} alt="KSHS_logo" className="w-[300px]"/>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
