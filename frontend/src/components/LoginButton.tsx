// components/LoginButton.tsx
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const LoginButton: React.FC = () => {
  const { data: session } = useSession();

  const [hover, setHover] = useState<boolean>(false);

  const hoverFunction = (bool:boolean) => {
    setHover(bool);
  };

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
          <button className="relative flex justify-center items-center" onClick={()=>signOut()} onMouseOver={()=>hoverFunction(true)} onMouseLeave={()=>hoverFunction(false)}>
              <img
                src={session.user?.image || '/default-avatar.png'}
                alt="profile img"
                className={`profileimg w-[35px] rounded-full absolute opacity-0 ${!hover ? 'opacity-100' : ''} duration-200`}
              />
              <div className={`w-[40px] h-[40px] flex justify-center items-center rounded-full bg-gray-300 -z-10 opacity-0 ${hover ? 'opacity-50' : ''} duration-200`}>
                <Icon className="text-2xl text-black" icon="material-symbols:logout"/>
              </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
