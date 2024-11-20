'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import errorimg from '@/img/error404.png';
import Image from 'next/image';

function ErrorContent() {
  const searchParams = useSearchParams();
  let error = searchParams.get('error');

  if (error === 'cant-cfetch-calendar') {
    error = '캘린더 자료를 받지 못했습니다.';
  } else if (error === 'lplaylist-error' || error === 'wplaylist-error') {
    error = '노래 신청 중 서버통신 에러가 발생했습니다.';
  } else if (error === 'playlist-make-error') {
    error = '노래 신청 중 유튜브 api와 에러가 발생했습니다.';
  } else if (error === 'no-data-rended') {
    error = '아무 날짜도 입력받지 못했습니다.';
  } else if (error === 'email-err') {
    error = '학교 구글 계정으로 로그인 해주세요.';
  } else if (error === 'server-email') {
    error = '서버와 정보 통신에 실패했습니다.';
  } else if (error === 'login') {
    error = '구글 로그인 중 에러가 발생했습니다.';
  } else if (error === 'already-submit') {
    error = '이미 신청했습니다.';
  } else if (error === 'student-error') {
    error = '학생 정보 통신에 실패했습니다.';
  } else if (error === 'preparing') {
    error = '모바일은 아직 준비중입니다.';
  } else if (error === 'student-add-error'){
    error = '학생 생일 추가 중 문제가 발생했습니다.'
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <Image src={errorimg} alt="KSHS_logo" className="w-[300px]" />
      <div className="flex items-center">
        <p className="text-xl mr-[5px] font-bold">404</p>
        <div className="w-[2px] h-full bg-text"></div>
        <p className="text-xl text-center ml-[5px] font-semibold">{error}</p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
