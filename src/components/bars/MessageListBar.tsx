import React from "react";
import MessageListHeader from "./MessageListHeader";
import MessageItem from "../contents/MessageListItem";
import { User, Department } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";


interface MessageListBarProps {
  setSelectedUser: (user: User|null) => void;
  // selectedUser: User | null;
  
}



const MessageListBar:React.FC<MessageListBarProps> = ({ setSelectedUser }) => {
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
            <div className="flex flex-1 overflow-y-scroll px-[6px] flex-col " >
              {employees&&employees.map(employee =>(
                <MessageItem 
                
                key={employee._id}
            name={employee.name}
            avatarImage={employee.avatarImage}
            onClick={() => setSelectedUser(employee)} // Pass click handler
          />
              ))}
            </div>
        </div>
    );
};

export default MessageListBar;
