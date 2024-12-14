'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Icon } from '@iconify/react';
import { Skeleton } from './ui/skeleton';

const LoginButton: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <button
          onClick={() => signIn('google')}
          className="flex justify-center items-center"
        >
          <Icon
            icon="ri:google-fill"
            className="text-3xl text-lighttext hover:text-text transform duration-150"
          ></Icon>
        </button>
      ) : (
        <div className='rounded-full w-[35px] h-[35px] relative flex items-center justify-center'>
          {session.user?.image ? (
            <div className='profileImg w-[40px] h-[40px] flex justify-center items-center'>
              <button className='border-none profileImg_ch' onClick={() => signOut()}>
                <img
                  src={session.user?.image}
                  alt="profile img"
                  className="w-[35px] rounded-full z-30"
                />
              </button>
              <Icon icon="material-symbols:logout" className='text-lighttext text-xl absolute z-20'/>
            </div>
          ) : (
            <Skeleton className="w-[35px] h-[35px] rounded-full absolute bg-gray-200" />
          )}
        </div>
      )}
    </div>
  );
};

export default LoginButton;