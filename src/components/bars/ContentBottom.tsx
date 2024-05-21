// import { SmileIcon } from "src/svgs";
import { Button, Input } from "@nextui-org/react";
import SendSharpIcon from '@mui/icons-material/SendSharp';
import useAxiosPrivate from "src/app/api/useAxiosPrivate";

import { User } from "src/types/userType";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import useSocketConnection from "src/hooks/useSocketConnection";

interface ContentBottomProps {
    selectedUser: User;
    onNewMessage: (message: string) => void;
  }

const ContentBottom: React.FC<ContentBottomProps> = ({ selectedUser, onNewMessage }) => {
  const axiosPrivate = useAxiosPrivate();  
  const [message, setMessage] = useState('');
    const { data: session } = useSession();
    const user = session?.user;
    const handleSendMessage = async () => {
        if (!message.trim()) return;
    
        try {
          const response = await axiosPrivate.post('/save-chat',JSON.stringify({
            receiverId: selectedUser._id,
            senderId:user?._id, // Replace with the actual sender ID
            message: message.trim(),
          }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
      );
    
          if (response.status === 200) {
            onNewMessage(message.trim());
            setMessage('');

            
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };


    return (
        <div className="flex flex-row dark:bg-dark bg-bg h-[60px] items-center gap-2 border-1 m-4">
            <Input
                className="h-[50px] overflow-hidden"
                placeholder="Aa"
                radius="full"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                size="sm"
                classNames={{
                    inputWrapper:
                        "data-[hover=true]:bg-default-100 min-h-[50px] pr-1 border-1 border-button",
                    base: ["h-[50px]"],
                }}
                endContent={
                    <button className="flex p-0 rounded-full btn-send" onClick={handleSendMessage}>
                        <SendSharpIcon sx={{color: '#C89E31'}} />
                    </button>
                }
            />
        </div>
    );
};

export default ContentBottom;
