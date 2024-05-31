"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "src/components/bars/Sidebar";
import MessageListBar from "src/components/bars/MessageListBar";
import MessageContent from "src/components/contents/MessageContent";
import { User } from "src/types/userType";
import { useSocket } from "src/hooks/useSocketConnection";
import { IMessage } from "src/types/messageType";
import { useSession } from "next-auth/react";
import { axiosPrivate } from "src/apis/axios";

export interface ILastMessage {
    userId: string;
    lastMessage: string;
}

interface ILastGroupMessage {
    groupId: string;
    groupName: string;
    groupImage: string;
    lastMessage: string;
}

interface ILastMessages {
    messageHistory: ILastMessage[];
    groupHistory: ILastGroupMessage[];
    createdAt: string;
}

function Message() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessages, setNewMessages] = useState<IMessage[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [lastMess, setLastMess] = useState<ILastMessage[]>();
    const socket = useSocket();
    const { data: session } = useSession();
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

    useEffect(() => {
        if (selectedUser && session?.user._id) {
            socket?.emit("existsMessage", {
                senderId: session.user._id,
                receiverId: selectedUser._id,
            });
            socket?.on("loadMessages", (data) => {
                setMessages(data.messages);
            });
        }
        socket?.on("loadNewChat", ({ chat }: { chat: IMessage }) => {
            // console.log({chat})
            setNewMessages([...newMessages, chat]);
            if (
                (selectedUser?._id == chat.senderId &&
                    session?.user._id == chat.receiverId) ||
                (selectedUser?._id == chat.receiverId &&
                    session?.user._id == chat.senderId)
            ) {
                const addedMessages = [...messages, chat];
                setMessages((prev) => [...prev, chat]);
            }
        });

        return () => {
            socket?.off("loadMessages");
        };
    }, [selectedUser, session?.user._id]);

    useEffect(() => {
        const getLastMessage = async () => {
            try {
                const res = await axiosPrivate.get<ILastMessages>(
                    `/message-history/${session?.user._id}`,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                console.log(res.data.messageHistory);
                setLastMess(res.data.messageHistory);
            } catch (e) {
                console.log({ e });
            }
        };
        getLastMessage();
    }, [newMessages]);
    return (
        <div className="flex-1 p-4 h-full w-full flex gap-4 bg-white dark:bg-bg_dark">
            <MessageListBar
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                itemClick={itemClick}
                getLatest={getLatest}
                lastMess={lastMess}
            />
            <MessageContent
                selectedUser={selectedUser}
                messages={messages}
                setMessages={setMessages}
            />
        </div>
    );
}

export default Message;
