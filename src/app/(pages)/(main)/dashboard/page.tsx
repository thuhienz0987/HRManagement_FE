"use client";
import Calendar from "src/components/calendar";
import CircleProgress from "src/components/circleProgress";
import StackChart from "src/components/stackChart";
import { User } from "@nextui-org/react";
import AttendanceCalendar from "src/components/attendanceCalendar";
import DayCounter from "src/components/dayCounter";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";

type TodayStatuses = {
    onTimeEmployeesToday: number;
    lateEmployeesToday: number;
    onTimePercentageChange: number;
    latePercentageChange: number;
    totalEmployees: number;
};

const DashBoard = () => {
    const { data: session } = useSession();
    const axiosPrivate = useAxiosPrivate();
    const [status, setStatus] = useState<TodayStatuses>();

    useEffect(() => {
        const getTodayStatuses = async () => {
            try {
                const res = await axiosPrivate.get<TodayStatuses>(
                    "/attendanceEmployeeToday",
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                console.log(res.data);
                setStatus(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getTodayStatuses();
    }, []);

    return (
        <div className="flex flex-1 py-6 flex-col gap-y-10 md:px-8 px-3">
            <div className="flex flex-1">
                <div className="flex flex-col gap-y-10 w-4/6">
                    <User
                        className="self-start"
                        name={
                            <p className=" text-2xl font-medium">
                                Hi, {session?.user.name}
                            </p>
                        }
                        description={
                            <p className="text-[#C89E31]">
                                {session?.user.positionId.name}
                            </p>
                        }
                        avatarProps={{
                            src: session?.user.avatarImage,
                            size: "lg",
                        }}
                    />
                    {status && (
                        <div className="flex gap-5 flex-col flex-wrap md:flex-row xl:flex-nowrap">
                            <CircleProgress
                                label="Total employees"
                                value={status.totalEmployees.toString()}
                                percentage={
                                    ((status.onTimeEmployeesToday +
                                        status.lateEmployeesToday) /
                                        status.totalEmployees) *
                                    100
                                }
                                color={undefined}
                            />
                            <CircleProgress
                                label="Present on time"
                                percentage={
                                    (status.onTimeEmployeesToday /
                                        status.totalEmployees) *
                                    100
                                }
                                value={status.onTimeEmployeesToday.toString()}
                                color="success"
                                incOrDec={status.onTimePercentageChange}
                            />
                            <CircleProgress
                                label="Late employees"
                                percentage={
                                    (status.lateEmployeesToday /
                                        status.totalEmployees) *
                                    100
                                }
                                value={status?.lateEmployeesToday.toString()}
                                color="warning"
                                incOrDec={status.latePercentageChange}
                            />
                        </div>
                    )}
                    <StackChart />
                </div>
                <div className="flex flex-col gap-y-8 w-2/6 pl-5 items-center">
                    <AttendanceCalendar />
                    <DayCounter />
                </div>
            </div>

            <Calendar />
        </div>
    );
};

export default DashBoard;
