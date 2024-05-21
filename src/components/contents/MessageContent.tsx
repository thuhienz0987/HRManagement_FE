import React , {useState} from "react";
import OpponentMessage from "./OpponentMessage";
import ContentHeader from "../bars/ContentHeader";
import ContentBottom from "../bars/ContentBottom";
import ContentBody from "./ContentBody";
import { User } from "src/types/userType";
import { useSession } from "next-auth/react"

interface MessageContentProps {
    selectedUser: User | null;
}


const MessageContent : React.FC<MessageContentProps>= ({ selectedUser }) => {
  const { data: session } = useSession();
    const [messages, setMessages] = useState<{ message: string; sender: User }[]>([]);

    const handleNewMessage = (message: string) => {
      if (selectedUser) {
        setMessages((prevMessages) => [...prevMessages, { message, sender: selectedUser }]);
      }
    };

    if (!selectedUser) {
      return <div className="flex flex-col flex-1 rounded-xl bg-bg dark:bg-dark bg-cover relative overflow-hidden max-h-screen">No user selected</div>;
    }
  
    return (
        <div className="flex flex-col flex-1 rounded-xl bg-bg dark:bg-dark bg-cover  relative overflow-hidden max-h-screen">
            {selectedUser && <ContentHeader selectedUser={selectedUser} />}
            <ContentBody messages={messages} selectedUser={selectedUser}/>
            {selectedUser && <ContentBottom selectedUser={selectedUser} onNewMessage={handleNewMessage} />}
        </div>
    );
};

export default MessageContent;
