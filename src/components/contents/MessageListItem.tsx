import { Button } from "@nextui-org/react";
import AvatarComponent from "../others/Avatar";
import { useEffect, useState } from "react";

type MessageItemProps = {
    selected: boolean;
    name: string;
    avatarImage: string;
    onClick: () => void; // Add onClick prop
    isOnline: string;
    _id: string;
    createdAt: Date | undefined;
    newMessage: string | undefined;
    lastMessage: string | undefined;
};

const MessageItem: React.FC<MessageItemProps> = ({
    selected,
    name,
    avatarImage,
    onClick,
    isOnline,
    _id: opponentId,
    createdAt,
    newMessage,
    lastMessage,
}) => {

    // const [time, setTime] = useState();

    const getTime = () => {
        let time: Date = new Date();
        const now: Date = new Date();
        if (createdAt)
            time = new Date(createdAt.toString());
        else
            return ""
        const distance = (now.getTime() - time.getTime())/1000;
        if(distance < 60)
            return "Just now";
        else if (distance < 60*60)
            return `${Math.round(distance/60)} minutes ago`;
        else if (distance < 60*60*24)
            return `${Math.round(distance/(60*60))} hours ago`;
        else
            return `${Math.round(distance/(60*60*24))} days ago`;
    }
    useEffect(() => {
         
        });
    
    return (
        <div className="w-full h-[68px] p-[4px] rounded-sm">
            {/* <div className=" flex flex-1 flex-row h-full "> */}
            <Button
                onPress={onClick}
                className={
                    selected
                        ? "bg-[#f5f5f5] text-button flex flex-1 flex-row h-full w-full rounded-md border-none focus:outline-none p-[10px] gap-0"
                        : "hover:bg-[#f5f5f5] hover:text-button flex flex-1 flex-row h-full w-full rounded-md bg-button border-none focus:outline-none p-[10px] gap-0"
                }
            >
                <AvatarComponent
                    size={36}
                    isOnline={isOnline}
                    imageLink={avatarImage}
                />
                <div className="flex flex-1 flex-col text-start pl-[10px]">
                    <span className="text-[15px] font-medium">{name}</span>
                    {/* <div className="block w-full h-2" /> */}
                    <div className="flex text-[13px] leading-4 font-normal">
                        {newMessage ? (
                            <span className="inline font-bold">
                                {newMessage}
                            </span>
                        ) : (
                            <span className="inline font-normal">
                                {lastMessage || "No message yet"}
                            </span>
                        )}

                        <span className="inline px-[2px]">·</span>
                        <span className="inline">{getTime()}</span>
                    </div>
                </div>
            </Button>
            {/* </div> */}
        </div>
    );
};

export default MessageItem;
