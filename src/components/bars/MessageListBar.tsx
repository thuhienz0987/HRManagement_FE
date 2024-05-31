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
import { ILastMessage } from "src/app/(pages)/(main)/message/page";

interface MessageListBarProps {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    itemClick: (opponentId: User) => void;
    getLatest: (id: string) => string | undefined;
    lastMess: ILastMessage[] | undefined;
}

const MessageListBar: React.FC<MessageListBarProps> = ({
    selectedUser,
    setSelectedUser,
    itemClick,
    getLatest,
    lastMess,
}) => {
    const axiosPrivate = useAxiosPrivate();

    const [employees, setEmployees] = useState<User[]>();
    const { data: session } = useSession();

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
        <div className="flex flex-col w-[88px] md:w-[360px] bg-bg dark:bg-dark rounded-xl relative max-h-[73vh]">
            <MessageListHeader setSelectedUser={setSelectedUser} />
            <div className="flex flex-1 overflow-y-scroll px-[6px] flex-col relative">
                {employees &&
                    employees.map((employee) => (
                        <MessageItem
                            selected={employee._id === selectedUser?._id}
                            isOnline={employee.isOnline}
                            key={employee._id}
                            name={employee.name}
                            _id={employee._id}
                            avatarImage={employee.avatarImage}
                            onClick={() => itemClick(employee)}
                            newMessage={getLatest(employee._id)}
                            lastMessage={
                                lastMess?.find(
                                    (mes) => mes.userId === employee._id
                                )?.lastMessage
                            }
                            createdAt={lastMess?.find(
                                (mes) => mes.userId === employee._id
                            )?.createdAt}
                        />
                    ))}
            </div>
        </div>
    );
};

export default MessageListBar;
