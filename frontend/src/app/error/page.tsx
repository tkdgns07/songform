'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import errorimg from '@/img/error404.png';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';

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
  } else if (error === 'weekend-submit'){
    error = '노동요는 주말에 신철할 수 없습니다.'
  } else if (error === 'student-error') {
    error = '학생 정보 통신에 실패했습니다.';
  } else if (error === 'preparing') {
    error = '모바일은 아직 준비중입니다.';
  } else if (error === 'student-add-error'){
    error = '학생 생일 추가 중 문제가 발생했습니다.'
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      {error? (
        <div className='flex flex-col items-center'>
            <Image src={errorimg} alt="KSHS_logo" className="w-[300px]" />
            <div className="flex items-center">
              <p className="text-xl mr-[5px] font-bold">404</p>
              <div className="w-[2px] h-full bg-text"></div>
              <p className="  text-xl text-center ml-[5px]">{error}</p>
            </div> 
            <div className='flex justify-center mt-[10px] relative items-center error-document w-fit'>
              <Link href={{ pathname: "/error" }}>
                <div className='bg- z-20'>
                  <p className='hover:text-cusblue-normal text-cusblue-light text-sm z-30'>Error Document</p>
                </div>
              </Link>
              <Icon
                  icon="uil:arrow-right"
                  className="text-gray-500 text-lg relative error-arow -z-10"
              ></Icon>
            </div>
        </div>
      ) : (
        <div className='flex flex-col h-[500px] justify-evenly'>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : cant-cfetch-calendar</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>주로 와이파이가 너무 느릴 때 발생합니다. API상 데이터베이스 연결 후 5초 이상의 지연이 생길 경우 이 에러를 강행합니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : lplaylist-error & wplaylist-error</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>노래 신청 후 데이터베이스에 값들을 추가하는 과정에서 발생하는 에러입니다. 연결 오류나 올바르지 않은 날짜 등을 요청할 때 발생합니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : playlist-make-error</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>유튜브 API 요청 시 발생하는 에러입니다. 노래 신청을 잘못했거나, 주로 Youtube API 토큰 만료시 발생합니다. 해당 에러가 지속될 시 개발자에게 문의해주세요.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : no-data-rended</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>/submit 페이지에서 발생합니다. URL param 중 date에 대한 값이 전달 받지 못했을 때 발생합니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : email-err</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>개인 구글 계정으로 로그인 할 시 발생합니다. 기상찬은 무조건 학교 구글 계정(h012s~@gw1.kr)를 받습니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : server-email</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>기본적인 데이터베이스 에러입니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : login</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>구글 로그인에서 발생하는 에러로, 발생 시 개발자에게 문의해주세요.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : already-submit</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>기상송이나 노동요 신청에서, 이미 신청한 상태에서 강제적으로 신청하려 할 시 발생합니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : disabled-submit</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>신청불가능한 날짜를 선택하면 발생합니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : student-error</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>로그인 후 jwt 토큰의 에러로 학생 정보를 불러오지 못했을 때 발생합니다. 다시 로그인 해 보시고, 지속적으로 발생한다면 개발자에게 문의해주세요.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : preparing</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>모바일 레이아웃을 접근하려 할 때 발생합니다. 아직 모바일 레이아웃은 준비중입니다.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
          <div className='flex flex-cols'>
            <p className='text-text font-bold'>Error : student-add-error</p>
            <div className='h-auto w-[1px] bg-text mx-[5px]'></div>
            <p className='text-text'>학생 정보 업데이트에서 발생하는 문제입니다. 다시 시도해도 발생한다면 개발자에게 문의해주세요.</p>
          </div>
          <div className='w-auto h-[1px] bg-text'></div>
        </div>
      )
    }
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
