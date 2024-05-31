import React, { useState } from "react";
import OpponentMessage from "./OpponentMessage";
import ContentHeader from "../bars/ContentHeader";
import ContentBottom from "../bars/ContentBottom";
import ContentBody from "./ContentBody";
import { User } from "src/types/userType";
import { useSession } from "next-auth/react";
import { IMessage } from "src/types/messageType";
import { ILastMessage } from "src/app/(pages)/(main)/message/page";

interface MessageContentProps {
    selectedUser: User | null;
    messages: IMessage[];
    setMessages:  (mess: IMessage[]) => void;
    setLastMess:  (mess: ILastMessage[]) => void;
    lastMess: ILastMessage[] | undefined;
}
// const MessageContent : React.FC<MessageContentProps>= ({ selectedUser }) => {

const MessageContent: React.FC<MessageContentProps> = ({
    selectedUser,
    messages,
    lastMess,
    setMessages,
    setLastMess
}) => {
    return (
        <div className="flex flex-col flex-1 rounded-xl bg-bg dark:bg-dark bg-cover  relative overflow-hidden max-h-[73vh]">
            {selectedUser && <ContentHeader selectedUser={selectedUser} />}
            <ContentBody selectedUser={selectedUser} messages={messages} />
            {selectedUser && <ContentBottom selectedUser={selectedUser} setMessages={setMessages} setLastMess={setLastMess} messages={messages} lastMess={lastMess}/>}
        </div>
    );
};

export default MessageContent;
