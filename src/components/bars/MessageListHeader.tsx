import React, { useState, useEffect, Key } from "react";
import { Button } from "@nextui-org/react";
import { AddMessageIcon } from "src/svgs";
import SearchBar from "../others/SearchBar";
import { User } from "src/types/userType";

interface MessageListHeaderProps {
    setSelectedUser: (user: User | null) => void;
}

const MessageListHeader: React.FC<MessageListHeaderProps> = ({
    setSelectedUser,
}) => {
    const [isUser, setIsUser] = useState(false);

    return (
        <div className="flex flex-col w-full relative border-b-1 border-button">
            <div className="flex flex-row w-full h-14 px-4 py-[4px] ">
                <div className="flex flex-row h-full items-center w-full justify-between">
                    <span className="text-[24px] font-bold text-button ">
                        CHAT
                    </span>
                    {/* <Button
                        isIconOnly
                        variant="solid"
                        className="w-[36px] h-[36px] bg-button focus:outline-none border-none p-0"
                        radius="full"
                        size="sm"
                        onPress={() => {
                            setIsUser(!isUser);
                        }}
                    >
                        <AddMessageIcon />
                    </Button> */}
                </div>
            </div>
            <SearchBar setSelectedUser={setSelectedUser} />
        </div>
    );
};

export default MessageListHeader;
