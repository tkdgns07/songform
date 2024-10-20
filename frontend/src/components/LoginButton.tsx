// components/LoginButton.tsx
'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";

const LoginButton: React.FC = () => {
  const { data: session } = useSession();
  
  const[dropout, setDropout] = useState<boolean>(false)

  const activedrop = () =>{
    setDropout(!dropout);
  }

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn("google")} className="flex justify-center items-center">
          <Icon icon="ri:google-fill" className="text-3xl text-lighttext hover:text-text transform duration-150"></Icon>
        </button>
      ) : (
        <div className="w-[35px] h-[35px] rounded-full profileframe">
          <button className=""  onClick={()=>activedrop()}>
            <img src={session.user?.image || "/default-avatar.png"} alt="profile img" className="profileimg w-full rounded-full"/>
          </button>
          <div className={`dropout w-[150px] p-[7px] rounded-lg transform transition-opacity bg-white ${dropout? 'opacity-100 duration-150 pointer-events-auto' : 'opacity-0 duration-150 pointer-events-none'}`}>
            <div>
              <div className="w-full flex justify-start px-[5px]">
                <p className="text-sm text-text font-semibold">{session.user?.name}</p>
              </div>
              <div className="w-full h-[1px] bg-frame my-[5px]"></div>
              <button onClick={() => signOut()} className="flex justify-start items-center p-[5px] w-full h-[30px] text-sm text-text rounded-lg font-semibold hover:bg-body">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
