import React, { useEffect, useState } from "react";
import OpponentMessage from "./OpponentMessage";
import { User } from "src/types/userType";
import { useSocket } from "src/hooks/useSocketConnection";
import { useSession } from "next-auth/react";
import SelfMessage from "./SelfMessage";
import { IMessage } from "src/types/messageType";
interface ContentBodyProps {
    selectedUser: User | null;
    messages: IMessage[];
}

const ContentBody: React.FC<ContentBodyProps> = ({
    selectedUser,
    messages,
}) => {
    const { data: session } = useSession();

    // useEffect(() => {
    //   socket?.on("loadNewChat", (data) => {
    //     console.log("data load new chats", data);
    //     // if (
    //     //   (data.senderId === session.user.id && data.receiverId === selectedUser._id) ||
    //     //   (data.senderId === selectedUser._id && data.receiverId === session.user.id)
    //     // ) {
    //     //   setMessages((prevMessages) => [...prevMessages, data]);
    //     // }
    //   });
    // }, [selectedUser]);

    if (!selectedUser) {
        return (
            <div className="flex flex-col flex-1 relative overflow-y-scroll">
                Start chat now!
            </div>
        );
    }
    return (
        <div
            dir="btt"
            className="flex flex-col flex-1 relative overflow-y-scroll"
        >
            {messages && messages.map((msg, index) =>
                msg?.senderId === session?.user._id ? (
                    <SelfMessage
                        key={index}
                        message={msg.message}
                        selectedUser={msg.receiverId}
                    />
                ) : (
                    <OpponentMessage
                        key={index}
                        message={msg.message}
                        selectedUser={msg.senderId}
                        avatarImage={selectedUser.avatarImage}
                    />
                )
            )}
        </div>
    );
};

export default ContentBody;
