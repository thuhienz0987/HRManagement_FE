"use client"
import React,  { useEffect, useState } from "react";
import Sidebar from "src/components/bars/Sidebar";
import MessageListBar from "src/components/bars/MessageListBar";
import MessageContent from "src/components/contents/MessageContent";
import { User } from "src/types/userType";
import { useSocket } from "src/hooks/useSocketConnection";

function Message() {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // const socket = useSocket();
    // useEffect(()=> {
    //     socket?.on("loadNewChat",(data)=>{
    //         console.log("data load new chats",data)
    //         // if (
    //         //   (data.senderId === session.user.id && data.receiverId === selectedUser._id) ||
    //         //   (data.senderId === selectedUser._id && data.receiverId === session.user.id)
    //         // ) {
    //         //   setMessages((prevMessages) => [...prevMessages, data]);
    //         // }
    //       });
    // }, [])
    return (
        <div className="flex-1 p-4 h-full w-full flex gap-4 bg-white dark:bg-bg_dark">
            <MessageListBar setSelectedUser={setSelectedUser}/>
           <MessageContent selectedUser={selectedUser} />
        </div>
    );
}

export default Message;
