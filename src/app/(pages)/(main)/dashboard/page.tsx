"use client";
import Calendar from "src/components/calendar";
import CircleProgress from "src/components/circleProgress";
import StackChart from "src/components/stackChart";
import { Skeleton, User } from "@nextui-org/react";
import AttendanceCalendar from "src/components/attendanceCalendar";
import DayCounter from "src/components/dayCounter";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import BarChart from "src/components/barChart";
import allowRows from "src/helper/allowRoles";

type TodayStatuses = {
    onTimeEmployeesToday: number;
    lateEmployeesToday: number;
    onTimePercentageChange: number;
    latePercentageChange: number;
    totalEmployees: number;
};

type Ratio = {
    result: {
        totalWorkingDays: number;
        totalWorkingDayRate: number;
        totalMonthlyWorkingDays: number;
        monthlyAttendanceRate: number;
        absentDays: number;
        absentDaysRate: number;
    };
};

const DashBoard = () => {
    const { data: session } = useSession();
    const axiosPrivate = useAxiosPrivate();
    const [status, setStatus] = useState<TodayStatuses>();
    const [employeeRatio, setEmployeeRatio] = useState<Ratio>();

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
        const getEmpRatio = async () => {
            try {
                const res = await axiosPrivate.get<Ratio>(
                    "/attendanceRatioForEmployee/" + session?.user._id,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                console.log(res.data);
                setEmployeeRatio(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getTodayStatuses();
        getEmpRatio();
        console.log("aa", { session });
    }, []);

    return (
        <div className="flex flex-1 py-6 flex-col gap-y-8 lg:px-8 px-3">
            <div className="flex flex-1   lg:flex-row flex-col max-sm:gap-y-4">
                <div className="flex flex-col gap-y-8 lg:w-4/6 w-full max-sm:gap-y-4">
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
                    {status ? (
                        <div className="flex gap-5 flex-col flex-wrap md:flex-row xl:flex-nowrap max-sm:gap-y-4">
                            {session &&
                            allowRows(
                                [process.env.CEO, process.env.HRManager],
                                session?.user.roles
                            ) ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <CircleProgress
                                        label="Total working day"
                                        value={employeeRatio?.result.totalWorkingDays.toString()}
                                        percentage={
                                            (employeeRatio?.result
                                                .totalWorkingDayRate || 0) * 100
                                        }
                                        color={undefined}
                                    />
                                    <CircleProgress
                                        label="Monthly attendance"
                                        percentage={
                                            (employeeRatio?.result
                                                .monthlyAttendanceRate || 0) *
                                            100
                                        }
                                        value={employeeRatio?.result.totalMonthlyWorkingDays.toString()}
                                        color="success"
                                        // incOrDec={status.onTimePercentageChange}
                                    />
                                    <CircleProgress
                                        label="Total absents"
                                        percentage={
                                            (employeeRatio?.result
                                                .absentDaysRate || 0) * 100
                                        }
                                        value={employeeRatio?.result.absentDays.toString()}
                                        color="warning"
                                        // incOrDec={status.latePercentageChange}
                                    />
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-5 flex-col flex-wrap md:flex-row xl:flex-nowrap">
                            <Skeleton className="rounded-xl flex-1 flex">
                                <div className="flex h-36 flex-1 min-w-fit flex-row border border-blue-700 rounded-xl px-6 items-center bg-white"></div>
                            </Skeleton>
                            <Skeleton className="rounded-xl flex-1 flex">
                                <div className="flex h-36 flex-1 min-w-fit flex-row border border-blue-700 rounded-xl px-6 items-center bg-white"></div>
                            </Skeleton>
                            <Skeleton className="rounded-xl flex-1 flex">
                                <div className="flex h-36 flex-1 min-w-fit flex-row border border-blue-700 rounded-xl px-6 items-center bg-white"></div>
                            </Skeleton>
                        </div>
                    )}
                    {session?.user.roles.includes(process.env.HRManager) && (
                        <StackChart />
                    )}
                    {session &&
                        !session.user.roles.includes(process.env.HRManager) && (
                            <BarChart userId={session?.user._id} />
                        )}
                </div>
                <div className="flex flex-col lg:gap-y-8 lg:w-2/6 w-full lg:pl-5 items-stretch lg:items-center md:mt-8 max-lg:flex-row md:gap-x-4 max-sm:flex-col max-sm:gap-y-4">
                    <AttendanceCalendar />
                    <DayCounter />
                </div>
            </div>

            <Calendar />
        </div>
    );
};

export default DashBoard;
