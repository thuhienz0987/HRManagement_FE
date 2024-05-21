"use client"
import React,  { useState } from "react";
import Sidebar from "src/components/bars/Sidebar";
import MessageListBar from "src/components/bars/MessageListBar";
import MessageContent from "src/components/contents/MessageContent";
import { User } from "src/types/userType";

function Message() {

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <div className="flex-1 p-4 h-full w-full flex gap-4 bg-white dark:bg-bg_dark">
            <MessageListBar setSelectedUser={setSelectedUser}/>
           <MessageContent selectedUser={selectedUser} />
        </div>
    );
}

export default Message;
