import React from "react";
import OpponentMessage from "./OpponentMessage";
import ContentHeader from "../bars/ContentHeader";
import ContentBottom from "../bars/ContentBottom";
import ContentBody from "./ContentBody";

const MessageContent = () => {
    return (
        <div className="flex flex-col flex-1 rounded-xl bg-bg dark:bg-dark bg-cover  relative overflow-hidden">
            <ContentHeader />
            <ContentBody />
            <ContentBottom />
        </div>
    );
};

export default MessageContent;
