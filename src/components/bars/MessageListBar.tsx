import React from "react";
import MessageListHeader from "./MessageListHeader";
import MessageItem from "../contents/MessageListItem";
import { User, Department } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";


type Employee = User 

const MessageListBar = () => {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();

    const [employees, setEmployees] = useState<Employee[]>();

    useEffect(() => {
        const getEmployees = async () => {
          try {
            const res = await axiosPrivate.get<Employee[]>("/all-user", {
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
        <div className="flex flex-col w-[88px] md:w-[360px] bg-bg dark:bg-dark rounded-xl md">
            <MessageListHeader />
            <div className="flex flex-1 overflow-y-scroll px-[6px]">
                <MessageItem />
                {/* {Array(5).map((item) => (
                    <MessageItem />
                ))} */}
            </div>
        </div>
    );
};

export default MessageListBar;
