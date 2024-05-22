// import { SmileIcon } from "src/svgs";
import { Button, Input } from "@nextui-org/react";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";

import { User } from "src/types/userType";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "src/hooks/useSocketConnection";
import { IMessage } from "src/types/messageType";

interface ContentBottomProps {
  selectedUser: User;
  setMessages:  (mess: IMessage[]) => void;
  messages: IMessage[];
}

const ContentBottom: React.FC<ContentBottomProps> = ({ selectedUser, setMessages, messages }) => {
  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const user = session?.user;

  const socket = useSocket();

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    try {
      const response = await axiosPrivate.post( 
        "/save-message",
        JSON.stringify({
          receiverId: selectedUser._id,
          senderId: user?._id,
          message: message.trim(),
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data)
        const mes: IMessage = response.data.data
        console.log({messages})
        const newArray = [...messages, mes]
        setMessages(newArray)
        setMessage("");
        socket?.emit("newChat", response.data);
      }
    } catch (error) {
      console.log("Error sending message:", {error});
    }
  };

  return (
    <div className="flex flex-row dark:bg-dark bg-bg h-[60px] items-center gap-2 border-1 m-4">
      <Input
        className="h-[50px] overflow-hidden"
        placeholder="Aa"
        radius="full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        size="sm"
        classNames={{
          inputWrapper:
            "data-[hover=true]:bg-default-100 min-h-[50px] pr-1 border-1 border-button",
          base: ["h-[50px]"],
        }}
        endContent={
          <button
            className="flex p-0 rounded-full btn-send"
            onClick={handleSendMessage}
          >
            <SendSharpIcon sx={{ color: "#C89E31" }} />
          </button>
        }
      />
    </div>
  );
};

export default ContentBottom;
