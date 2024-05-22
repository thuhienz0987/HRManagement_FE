"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "src/components/bars/Sidebar";
import MessageListBar from "src/components/bars/MessageListBar";
import MessageContent from "src/components/contents/MessageContent";
import { User } from "src/types/userType";
import { useSocket } from "src/hooks/useSocketConnection";
import { IMessage } from "src/types/messageType";
import { useSession } from "next-auth/react";

function Message() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessages, setNewMessages] = useState<IMessage[]>([]);
    const socket = useSocket();
    const { data: session } = useSession();
    useEffect(() => {
        return () => {
            // socket?.off("loadChats");
            socket?.off("loadNewChat");
            console.log("unmount1");
        };
    }, []);

    const getLatest = (opponentId: string) => {
        const filteredMessages = newMessages
            .filter(
                (mes) =>
                    mes.senderId == opponentId &&
                    mes.receiverId == session?.user._id
            )
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        // Get the latest message for the specified senderId
        const latestMessage =
            filteredMessages.length > 0
                ? filteredMessages[0].message
                : undefined;
        return latestMessage;
    };

    const itemClick = (employee: User) => {
        setSelectedUser(employee);
        const filteredNewMessages = newMessages.filter(
            (mes) => mes.senderId != employee._id
        );
        setNewMessages(filteredNewMessages);
    };

    /////////////////
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        if (selectedUser && session?.user._id) {
            socket?.emit("existsChat", {
                senderId: session.user._id,
                receiverId: selectedUser._id,
            });
            socket?.on("loadChats", (data) => {
                setMessages(data.chats);
            });
        }
        socket?.on("loadNewChat", ({ chat }: { chat: IMessage }) => {
            setNewMessages([...newMessages, chat]);
            console.log("loadNewChat");
            console.log(
                (selectedUser?._id == chat.senderId &&
                    session?.user._id == chat.receiverId) ||
                    (selectedUser?._id == chat.receiverId &&
                        session?.user._id == chat.senderId)
            );
            if (
                (selectedUser?._id == chat.senderId &&
                    session?.user._id == chat.receiverId) ||
                (selectedUser?._id == chat.receiverId &&
                    session?.user._id == chat.senderId)
            ) {
                const addedMessages = [...messages, chat];
                console.log("add to array");
                setMessages(addedMessages);
            }
        });

        return () => {
            socket?.off("loadChats");
        };
    }, [selectedUser, session?.user._id]);
    return (
        <div className="flex-1 p-4 h-full w-full flex gap-4 bg-white dark:bg-bg_dark">
            <MessageListBar
                setSelectedUser={setSelectedUser}
                itemClick={itemClick}
                getLatest={getLatest}
            />
            <MessageContent selectedUser={selectedUser} messages={messages} />
        </div>
    );
}

export default Message;
