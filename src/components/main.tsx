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
import AttendanceIcon from "src/svgs/attendance";
import StarIcon from "src/svgs/star";

const Main = ({ children }: { children: React.ReactNode }) => {
    const initMode: SideBarMode = SideBarMode.Large;
    const [mode, setMode] = useState<SideBarMode>(initMode);

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login");
        },
    });
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
                    isHidden: !session?.user.roles.includes(
                        process.env.HRManager
                    ),
                },
                {
                    name: "Daily Attendance",
                    href: "/daily",
                },
                {
                    name: "Absent List",
                    href: "/absent",
                },
                {
                    name: "Absent Form",
                    href: "/absent-form",
                },
                {
                    name: "Attendance Log",
                    href: "/log",
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
                },
                {
                    name: "Add New Employee",
                    href: "/add-employee",
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
                        session?.user.roles.includes(process.env.TeamManager)
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
            name: "Reports",
            href: "/reports",
            icon: PresentationChartLineIcon,
            subSidebar: [
                {
                    name: "Attendance Report",
                    href: "/attendance",
                },
                {
                    name: "Leave Report",
                    href: "/leave",
                },
                {
                    name: "New Attendance Report",
                    href: "/new-attendance",
                },
                {
                    name: "Outcome Report",
                    href: "/outcome",
                },
            ],
            isHidden: false,
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
    ];
    const segments = useSelectedLayoutSegments();
    const option = SideBarOps.find((opt) => opt.href == "/" + segments[0]);
    const subOption = option?.subSidebar.find(
        (subOpt) => subOpt.href == "/" + segments[1]
    );

    if (session)
        return (
            <>
                <Header mode={mode} setMode={setMode} />
                <div className="flex absolute w-full pt-[3.5rem]">
                    <SideBar
                        mode={mode}
                        setMode={setMode}
                        SideBarOps={SideBarOps}
                    />
                    <div
                        className={
                            " flex min-h-[calc(100vh-3.5rem)] flex-col absolute right-0 overflow-y duration-300 -z-10 w-full bg-bg " +
                            (mode == SideBarMode.Large
                                ? " md:w-[calc(100%-14rem)]"
                                : " md:w-[calc(100%-56px)]")
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
};

export default Main;
