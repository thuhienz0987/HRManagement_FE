"use client";
import { useState } from 'react';
import AvatarComponent from "../others/Avatar";
import { useSession } from 'next-auth/react';
import { User } from "src/types/userType";
import { useSocket } from 'src/hooks/useSocketConnection';

interface OpponentMessageProps {
  selectedUser: string;
  avatarImage: string;
  message: string;
  createdAt: Date;
}


const OpponentMessage: React.FC<OpponentMessageProps> = ({selectedUser,message, avatarImage,createdAt}) => {
  const [showTime, setShowTime] = useState(false);
  const { data: session } = useSession();
  const url = session?.user.avatarImage;
  const socket = useSocket()

  const getTime = () =>{
    let time = "";
    time += `${new Date(createdAt.toString()).getHours()}:`;
    time += `${new Date(createdAt.toString()).getMinutes()} `;
    if((new Date().getTime() - new Date(createdAt.toString()).getTime()) <= (60*60*24))
      return time + "today";
    time += `${new Date(createdAt.toString()).getDay()}/`;
    time += `${new Date(createdAt.toString()).getMonth()}`;
    return time;
  }
  
  return (
    <div className="flex flex-col-reverse">
      <div className="flex flex-row items-start m-2">
        <AvatarComponent imageLink={avatarImage} />
        <div
          className="flex max-w-1/2 md:max-w-[67%] bg-button w-fit px-3 py-2 rounded-[18px] mx-2"
          onMouseEnter={() => setShowTime(true)}
          onMouseLeave={() => setShowTime(false)}
        >
          <p className="w-full break-words text-[15px]">
            {message}
          </p>
        </div>
        {showTime && (
            <div className='flex justify-center items-center h-full'>
                <p className="dark:text-bg text-dark text-sm">{getTime()}</p>
            </div>
        )}
      </div>

      
    </div>
  );
};

export default OpponentMessage;
