import React from "react";
import MessageListHeader from "./MessageListHeader";
import MessageItem from "../contents/MessageListItem";
import { User, Department } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { useSocket } from "src/hooks/useSocketConnection";
import { useSession } from "next-auth/react";
import { IMessage } from "src/types/messageType";

interface MessageListBarProps {
    setSelectedUser: (user: User | null) => void;
    itemClick: (opponentId: User) => void;
    getLatest: (id: string) => string | undefined;
}

const MessageListBar: React.FC<MessageListBarProps> = ({
    setSelectedUser,
    itemClick,
    getLatest,
}) => {
    const axiosPrivate = useAxiosPrivate();

    const [employees, setEmployees] = useState<User[]>();

    useEffect(() => {
        const getEmployees = async () => {
            try {
                const res = await axiosPrivate.get<User[]>("/all-user", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                res.data.map((employee) => {
                    employee.createdAt = format(
                        parseISO(employee.createdAt),
                        "dd/MM/yyyy"
                    );
                });
                setEmployees(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getEmployees();
    }, []);

    return (
        <div className="flex flex-col w-[88px] h-1/2 md:w-[360px] bg-bg dark:bg-dark rounded-xl md max-h-screen">
            <MessageListHeader setSelectedUser={setSelectedUser} />
            <div className="flex flex-1 overflow-y-scroll px-[6px] flex-col ">
                {employees &&
                    employees.map((employee) => (
                        <MessageItem
                            isOnline={employee.isOnline}
                            key={employee._id}
                            name={employee.name}
                            _id={employee._id}
                            avatarImage={employee.avatarImage}
                            onClick={() => itemClick(employee)}
                            newMessage={getLatest(employee._id)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default MessageListBar;
