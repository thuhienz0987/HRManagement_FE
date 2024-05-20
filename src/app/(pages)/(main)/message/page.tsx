"use client"
import React from "react";
import Sidebar from "src/components/bars/Sidebar";
import MessageListBar from "src/components/bars/MessageListBar";
import MessageContent from "src/components/contents/MessageContent";

function Message() {
    return (
        <div className="flex-1 p-4 h-full w-full flex gap-4 bg-white dark:bg-bg_dark">
            <Sidebar />
            {/* <SidebarButton Icon={MessageIcon} /> */}
            <MessageListBar />
            <MessageContent />
        </div>
    );
}

export default Message;
