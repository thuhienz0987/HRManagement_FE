"use client";
import { useState } from "react";
import AvatarComponent from "../others/Avatar";
import { useSession } from "next-auth/react";
import { User } from "src/types/userType";
import { useSocket } from "src/hooks/useSocketConnection";

interface SelfMessageProps {
  selectedUser: string;
  message: string;
}

const SelfMessage: React.FC<SelfMessageProps> = ({ selectedUser, message }) => {
  const [showTime, setShowTime] = useState(false);
  const { data: session } = useSession();
  const socket = useSocket();

  return (
    <div className="flex flex-col-reverse h-full">
      <div className="flex flex-row items-start m-2 justify-end">
        <div
          className="max-w-1/2 md:max-w-[67%] bg-button w-fit px-3 py-2 rounded-[18px] mx-2"
          onMouseEnter={() => setShowTime(true)}
          onMouseLeave={() => setShowTime(false)}
        >
          <p className="w-full break-words text-[15px]">{message}</p>
        </div>
        {/* <AvatarComponent imageLink={url} /> */}
      </div>
    </div>
  );
};

export default SelfMessage;
