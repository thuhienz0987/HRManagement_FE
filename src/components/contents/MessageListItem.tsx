import { Button } from "@nextui-org/react";
import AvatarComponent from "../others/Avatar";

type MessageItemProps = {
    name: string;
    avatarImage: string;
    onClick: () => void; // Add onClick prop
    isOnline: string;
    _id: string;
    newMessage: string | undefined;
    lastMessage: string | undefined;
};

const MessageItem: React.FC<MessageItemProps> = ({
    name,
    avatarImage,
    onClick,
    isOnline,
    _id: opponentId,
    newMessage,
    lastMessage
}) => {
    return (
        <div className="w-full h-[68px] p-[4px] rounded-sm">
            {/* <div className=" flex flex-1 flex-row h-full "> */}
            <Button
                onPress={onClick}
                className="hover:bg-[#f5f5f5] hover:text-button flex flex-1 flex-row h-full w-full rounded-md bg-button border-none focus:outline-none p-[10px] gap-0"
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
                        {newMessage?
                            <span className="inline font-bold">{newMessage}</span>
                            :
                            <span className="inline font-normal">{lastMessage || "No message yet"}</span>
                        }
                        
                        <span className="inline px-[2px]">·</span>
                        <span className="inline">1 ngày</span>
                    </div>
                </div>
            </Button>
            {/* </div> */}
        </div>
    );
};

export default MessageItem;
