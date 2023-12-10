import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isEqual,
    isSameDay,
    parse,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfToday,
    startOfWeek,
    add,
    isToday,
    isSameMonth,
    addDays,
} from "date-fns";
import { useEffect, useState } from "react";
import { CalendarIcon } from "src/svgs";
import { ScrollShadow } from "@nextui-org/react";
import { Tenor_Sans } from "next/font/google";
import { Attendance } from "src/types/attendanceType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useSession } from "next-auth/react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../../@/components/ui/hover-card";
import capitalizeFLetter from "src/helper/capitalizeLetter";

const meetings = [
    {
        id: 1,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-11T13:00",
        endDatetime: "2022-05-11T14:30",
    },
    {
        id: 2,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T09:00",
        endDatetime: "2022-05-20T11:30",
    },
    {
        id: 3,
        name: "Dries Vincent",
        imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T17:00",
        endDatetime: "2022-05-20T18:30",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-06-09T13:00",
        endDatetime: "2022-06-09T14:30",
    },
    {
        id: 5,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-13T14:00",
        endDatetime: "2022-05-13T14:30",
    },
];

const tenor_sans = Tenor_Sans({ subsets: ["latin"], weight: "400" });

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type MonthAttendance = {
    year: number;
    month: number;
    attendance: Attendance[];
};

function AttendanceCalendar() {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    const [loading, setLoading] = useState<boolean>(false);
    const [attendances, setAttendances] = useState<MonthAttendance[]>([]);
    const axiosPrivate = useAxiosPrivate();
    console.log(attendances);
    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

    let days = eachDayOfInterval({
        start: addDays(startOfWeek(firstDayCurrentMonth), 1),
        end:
            addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), 1).getDate() ==
            7
                ? addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), -6)
                : addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), 1),
    });

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
        const existedMonthData = attendances.find(
            (monthAttendance) =>
                monthAttendance.month == firstDayNextMonth.getMonth() + 1 &&
                monthAttendance.year == firstDayNextMonth.getFullYear()
        );
        if (!existedMonthData) {
            getMonthAttendance(
                firstDayNextMonth.getMonth() + 1,
                firstDayNextMonth.getFullYear()
            );
        }
    }

    function previousDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);

        return previous;
    }

    function nextDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() + 1);

        return previous;
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
        const existedMonthData = attendances.find(
            (monthAttendance) =>
                monthAttendance.month == firstDayNextMonth.getMonth() + 1 &&
                monthAttendance.year == firstDayNextMonth.getFullYear()
        );
        if (!existedMonthData) {
            getMonthAttendance(
                firstDayNextMonth.getMonth() + 1,
                firstDayNextMonth.getFullYear()
            );
        }
    }

    const { data: session } = useSession();

    useEffect(() => {
        getMonthAttendance(today.getMonth() + 1, today.getFullYear());
        if (today.getMonth() != firstDayCurrentMonth.getMonth())
            getMonthAttendance(
                firstDayCurrentMonth.getMonth() + 1,
                firstDayCurrentMonth.getFullYear()
            );
    }, []);

    const getMonthAttendance = async (month: number, year: number) => {
        setLoading(true);
        try {
            const res = await axiosPrivate.get<Attendance[]>(
                `/attendanceByMonth/${month}/${year}/${session?.user._id}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setAttendances([
                ...attendances,
                {
                    month,
                    year,
                    attendance: res.data,
                },
            ]);
        } catch (e) {
            console.log({ e });
        } finally {
            setLoading(false);
        }
    };

    const dateStatus = (date: Date) => {
        const monthAttendance = attendances.find(
            (d) =>
                d.month == date.getMonth() + 1 && d.year == date.getFullYear()
        );
        if (!monthAttendance) return "null";
        const dateAttendance = monthAttendance.attendance.find((d) => {
            const attendanceDate = new Date(d.attendanceDate);
            return attendanceDate.getDate() == date.getDate();
        });
        if (!dateAttendance) return "absent";
        const checkInTime = new Date(dateAttendance.checkInTime);

        console.log(checkInTime.getHours());
        if (
            checkInTime.getHours() > 7 ||
            (checkInTime.getHours() == 7 && checkInTime.getMinutes() >= 30)
        )
            return "late";
        if (dateAttendance.checkOutTime) {
            const checkOutTime = new Date(dateAttendance.checkOutTime);
            if (checkOutTime.getHours() <= 17) return "late";
        }
        return "ok";
    };
    return (
        <div className="flex flex-col border bg-bar p-2 rounded-xl overflow-hidden self-center">
            <h3
                className={`self-center my-2 text-xl font-medium text-[#C89E31] ${tenor_sans.className}`}
            >
                Your Attendance
            </h3>
            <div className="flex flex-1 justify-center">
                <div className=" flex w-full shadow-lg flex-col">
                    <div
                        className={`rounded-md bg-white pt-2 ${
                            loading && " blur-sm"
                        }`}
                    >
                        <div className="px-4 flex items-center justify-between">
                            <span
                                // tabindex="0"
                                className="focus:outline-none  text-base font-bold text-gray-800"
                            >
                                {format(firstDayCurrentMonth, "MMM yyyy")}
                            </span>
                            <div className="flex items-center">
                                <button
                                    onClick={previousMonth}
                                    aria-label="calendar backward"
                                    className="focus:text-gray-400 hover:text-gray-400 text-gray-800"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-left"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <polyline points="15 6 9 12 15 18" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextMonth}
                                    aria-label="calendar forward"
                                    className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler  icon-tabler-chevron-right"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <polyline points="9 6 15 12 9 18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between overflow-x-auto flex-col">
                            <div className="grid grid-cols-7 pt-3 w-full">
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Mo
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Tu
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        We
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Th
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Fr
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Sa
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Su
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 lg:pt-6 w-full">
                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`px-2 py-1 lg:py-2 cursor-pointer flex w-full justify-center relative`}
                                    >
                                        <div
                                            className={`absolute w-full self-center h-8 ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(
                                                            previousDay(day)
                                                        )
                                                    ) &&
                                                dateStatus(day) == "late" &&
                                                "bg-gradient-to-r from-yellow-500 from-50% to-50% to-transparent opacity-70"
                                            } ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(nextDay(day))
                                                    ) &&
                                                dateStatus(day) == "late" &&
                                                "bg-gradient-to-r to-yellow-500 from-50% to-50% from-transparent opacity-70"
                                            } ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(nextDay(day))
                                                    ) &&
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(
                                                            previousDay(day)
                                                        )
                                                    ) &&
                                                dateStatus(day) == "late" &&
                                                "bg-yellow-500 opacity-70"
                                            } ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(
                                                            previousDay(day)
                                                        )
                                                    ) &&
                                                dateStatus(day) == "ok" &&
                                                "bg-gradient-to-r from-[#29AB91] from-50% to-50% to-transparent opacity-70"
                                            }  ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(nextDay(day))
                                                    ) &&
                                                dateStatus(day) == "ok" &&
                                                "bg-gradient-to-r to-[#29AB91] from-50% to-50% from-transparent opacity-70"
                                            } ${
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(nextDay(day))
                                                    ) &&
                                                dateStatus(day) ===
                                                    dateStatus(
                                                        new Date(
                                                            previousDay(day)
                                                        )
                                                    ) &&
                                                dateStatus(day) == "ok" &&
                                                "bg-[#29AB91] opacity-70"
                                            }`}
                                        />
                                        <HoverCard>
                                            <HoverCardTrigger className="z-10">
                                                <button
                                                    type="button"
                                                    // onClick={() => setSelectedDay(day)}
                                                    className={`
                                                    ${
                                                        isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        "text-[#2C3D3A] font-semibold"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        isSameMonth(
                                                            day,
                                                            firstDayCurrentMonth
                                                        ) &&
                                                        dateStatus(day) !=
                                                            "null" &&
                                                        "text-[#F5F5DC]"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        isSameMonth(
                                                            day,
                                                            firstDayCurrentMonth
                                                        ) &&
                                                        dateStatus(day) ==
                                                            "null" &&
                                                        "text-slate-800"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        !isSameMonth(
                                                            day,
                                                            firstDayCurrentMonth
                                                        ) &&
                                                        "text-slate-500"
                                                    }
                                                    ${
                                                        dateStatus(day) ==
                                                            "absent" &&
                                                        "bg-red-500"
                                                    }
                                                    ${
                                                        dateStatus(day) ==
                                                            "absent" &&
                                                        "bg-red-500"
                                                    }
                                                    ${
                                                        dateStatus(day) ==
                                                            "late" &&
                                                        "bg-yellow-500"
                                                    }
                                                    ${
                                                        dateStatus(day) ==
                                                            "ok" &&
                                                        "bg-[#29AB91]"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) && "hover:bg-gray-200"
                                                    }
                                                    ${
                                                        ((isEqual(
                                                            day,
                                                            selectedDay
                                                        ) ||
                                                            isToday(day)) &&
                                                            "font-semibold",
                                                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full")
                                                    }
                                            `}
                                                >
                                                    <time
                                                        dateTime={format(
                                                            day,
                                                            "yyyy-MM-dd"
                                                        )}
                                                    >
                                                        {format(day, "d")}
                                                    </time>
                                                </button>
                                            </HoverCardTrigger>

                                            <HoverCardContent className="bg-white py-1">
                                                {capitalizeFLetter(
                                                    dateStatus(day)
                                                )}
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendanceCalendar;
