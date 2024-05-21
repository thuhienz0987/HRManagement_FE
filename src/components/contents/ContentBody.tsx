import React from 'react';
import OpponentMessage from "./OpponentMessage";
import { User } from "src/types/userType";

interface ContentBodyProps {
  messages: { message: string; sender: User }[];
  selectedUser: User | null;
}

const ContentBody: React.FC<ContentBodyProps> = ({ messages, selectedUser }) => {
  if (!selectedUser) {
    return <div className="flex flex-col flex-1 relative overflow-y-scroll">No user selected</div>;
  }
  return (
    <div className="flex flex-col flex-1 relative overflow-y-scroll">
      {messages.map((msg, index) => (
        <OpponentMessage key={index} message={msg.message} selectedUser={msg.sender} />
      ))}
    </div>
  );
};

export default ContentBody;
