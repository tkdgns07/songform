// components/LoginButton.tsx
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
        <div className="w-[35px] h-[35px] rounded-full">
          <button className="relative flex justify-center items-center" onClick={()=>signOut()}>
            {session.user?.image ?
              <img
                src={session.user?.image}
                alt="profile img"
                className="w-[35px] rounded-full absolute opacity-100 hover:opacity-0 duration-200"
              /> :
              <Skeleton className="w-[35px] h-[35px] rounded-full absolute bg-gray-200"/>
            }
            <div className="w-[35px] h-[35px] flex justify-center items-center rounded-full bg-gray-300 -z-10 opacity-50 duration-200">
              <Icon className="text-2xl text-black" icon="material-symbols:logout"/>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
