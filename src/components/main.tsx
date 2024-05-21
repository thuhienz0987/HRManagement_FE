"use client";
import { useEffect, useState } from "react";
import Footer from "./footer";
import SideBar, { SideBarMode } from "./sideBar";
import TraceBar from "./tracebar";
import { SideBarOptionType } from "./optionButton";
import {
    HomeIcon,
    PresentationChartLineIcon,
    SalaryIcon,
    UserIcon,
    FinanceIcon,
    SystemModifyIcon,
    AccountIcon,
} from "src/svgs";
import { redirect, useSelectedLayoutSegments } from "next/navigation";
import Header from "./header";
import { useSession } from "next-auth/react";
import { io } from 'socket.io-client'
import { BASE_URL } from "src/utils/api";
import AttendanceIcon from "src/svgs/attendance";
import StarIcon from "src/svgs/star";
import { usePosition } from "src/hooks/usePosition";
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';

const Main = ({ children }: { children: React.ReactNode }) => {
    const initMode: SideBarMode = SideBarMode.Large;
    const [mode, setMode] = useState<SideBarMode>(initMode);
    const [value] = usePosition();
    const [leftOrRight, setLOR] = useState(value);
    console.log({ value });

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/signIn");
        },
    });
    useEffect(() => {
        console.log("ROLES____+_", session);
    }, []);
    const SideBarOps: SideBarOptionType[] = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: HomeIcon,
            subSidebar: [],
            isHidden: false,
        },
        {
            name: "Attendance ",
            href: "/attendance",
            icon: AttendanceIcon,
            subSidebar: [
                {
                    name: "Attendance Form",
                    href: "/form",
                    isHidden: session?.user.roles.includes(
                        process.env.HRManager
                    )
                        ? false
                        : true,
                },
                {
                    name: "Daily Attendance",
                    href: "/daily",
                    isHidden:
                        session?.user.roles.includes(process.env.CEO) ||
                        session?.user.roles.includes(process.env.TeamManager) ||
                        session?.user.roles.includes(
                            process.env.DepartmentManager
                        ) ||
                        session?.user.roles.includes(process.env.HRManager)
                            ? false
                            : true,
                },
                {
                    name: "Absent List",
                    href: "/absent",
                    isHidden: session?.user.roles.includes(
                        process.env.HRManager
                    )
                        ? false
                        : true,
                },
                {
                    name: "Absent Form",
                    href: "/absent-form",
                },
                {
                    name: "Attendance Log",
                    href:
                        session?.user.roles.includes(process.env.HRManager) ||
                        session?.user.roles.includes(process.env.CEO)
                            ? "/log"
                            : "/log/" + session?.user._id,
                },
            ],
            isHidden: false,
        },
        {
            name: "Employee",
            href: "/employee",
            icon: UserIcon,
            subSidebar: [
                {
                    name: "Employee List",
                    href: "/employee-list",
                    isHidden:
                        session?.user.roles.includes(process.env.HRManager) ||
                        session?.user.roles.includes(process.env.CEO)
                            ? false
                            : true,
                },
                {
                    name: "Add New Employee",
                    href: "/add-employee",
                    isHidden: session?.user.roles.includes(
                        process.env.HRManager
                    )
                        ? false
                        : true,
                },
            ],
            isHidden: false,
        },
        {
            name: "Performance Rate",
            href: "/performance-rate",
            icon: StarIcon,
            subSidebar: [
                {
                    name: "Comment Form",
                    href: "/comment-form",
                    isHidden:
                        session?.user.roles.includes(process.env.CEO) ||
                        session?.user.roles.includes(
                            process.env.DepartmentManager
                        ) ||
                        session?.user.roles.includes(process.env.TeamManager) ||
                        session?.user.roles.includes(process.env.HRManager)
                            ? false
                            : true,
                },
                {
                    name: "Comment List",
                    href: "/comment-list",
                },
            ],
            isHidden: false,
        },
        {
            name: "Statistic",
            href: "/reports",
            icon: PresentationChartLineIcon,
            subSidebar: [
                {
                    name: "Attendance Statistic",
                    href: "/attendance",
                    isHidden:
                        session?.user.roles.includes(process.env.HRManager) ||
                        session?.user.roles.includes(process.env.CEO)
                            ? false
                            : true,
                },
                {
                    name: "Salary Statistic",
                    href: "/salary",
                    isHidden:
                        session?.user.roles.includes(process.env.HRManager) ||
                        session?.user.roles.includes(process.env.CEO)
                            ? false
                            : true,
                },
            ],
            //   isHidden: false,
            isHidden:
                session?.user.roles.includes(process.env.HRManager) ||
                session?.user.roles.includes(process.env.CEO)
                    ? false
                    : true,
        },
        {
            name: "Finance",
            href: "/finance",
            icon: FinanceIcon,
            subSidebar: [
                {
                    name: "Salary Payment",
                    href: "/salary-payment",
                },
            ],
            isHidden: false,
        },
        {
            name: "Account",
            href: "/account",
            icon: AccountIcon,
            subSidebar: [
                {
                    name: "Profile",
                    href: "/profile",
                    searchParams: "?id=" + session?.user._id,
                },
                {
                    name: "Edit Profile",
                    href: "/edit-profile",
                    searchParams: "?id=" + session?.user._id,
                    isHidden: session?.user.roles.includes(
                        process.env.HRManager
                    )
                        ? false
                        : true,
                },
            ],
            isHidden: false,
        },
        {
            name: "System Modify",
            href: "/system-modify",
            icon: SystemModifyIcon,
            subSidebar: [
                {
                    name: "Department",
                    href: "/department",
                },
                {
                    name: "Position",
                    href: "/position",
                },
                {
                    name: "Salary",
                    href: "/salary",
                },
            ],
            isHidden: false,
        },
        {
            name: "Message",
            href: "/message",
            icon: MarkUnreadChatAltOutlinedIcon,
            subSidebar: [
                
            ],
            isHidden: false,
        },
    ];
    const segments = useSelectedLayoutSegments();
    const option = SideBarOps.find((opt) => opt.href == "/" + segments[0]);
    const subOption = option?.subSidebar.find(
        (subOpt) => subOpt.href == "/" + segments[1]
    );

    if (session)
        {
            var sender_id = session.user._id;
            var socket = io(`${BASE_URL}/user-namespace`, {
                auth: {
                    token: session.user._id
                }
            })
            socket.on("receiveMessage", (message: string) => {
                console.log("Received message:", message);
                // Update state to display the new message
              });
            

            return (
                <>
                    <Header
                        mode={mode}
                        setMode={setMode}
                        SideBarOps={SideBarOps}
                        setLOR={setLOR}
                        leftOrRight={leftOrRight}
                    />
                    <div className="flex absolute w-full pt-[3.5rem]">
                        <SideBar
                            mode={mode}
                            setMode={setMode}
                            SideBarOps={SideBarOps}
                            setLOR={setLOR}
                            leftOrRight={leftOrRight}
                        />
                        <div
                            className={
                                " flex min-h-[calc(100vh-3.5rem)] flex-col absolute overflow-y duration-300 -z-10 w-full bg-bg dark:bg-bg_dark " +
                                (leftOrRight == "left" && " right-0 ") +
                                (mode == SideBarMode.Large
                                    ? " md:w-[calc(100%-14rem)] "
                                    : " md:w-[calc(100%-56px)] ") +
                                (mode == SideBarMode.Large && " max-md:blur-sm ") +
                                (leftOrRight == "right" &&
                                    mode == SideBarMode.Large &&
                                    " md:right-[14rem] ") +
                                (leftOrRight == "right" &&
                                    mode == SideBarMode.Small &&
                                    " md:right-[56px] ")
                            }
                        >
                            {option?.href !== "/dashboard" && (
                                <TraceBar option={option} subOption={subOption} />
                            )}
                            <div className="flex flex-col flex-1 h-full ">
                                {children}
                            </div>
                            <Footer />
                        </div>
                    </div>
                </>
            );
    }
};


export default Main;
