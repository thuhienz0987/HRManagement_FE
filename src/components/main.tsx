"use client";
import { useState } from "react";
import Footer from "./footer";
import SideBar, { SideBarMode } from "./sideBar";
import TraceBar from "./tracebar";
import { SideBarOptionType } from "./optionButton";
import {
    HomeIcon,
    PresentationChartLineIcon,
    SalaryIcon,
    UserIcon,
} from "src/svgs";
import { useSelectedLayoutSegments } from "next/navigation";

const Main = ({ children }: { children: React.ReactNode }) => {
    const initMode: SideBarMode = SideBarMode.Large;
    const [mode, setMode] = useState<SideBarMode>(initMode);
    const SideBarOps: SideBarOptionType[] = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: HomeIcon,
            subSidebar: [],
        },
        {
            name: "Attendance",
            href: "/attendance",
            icon: UserIcon,
            subSidebar: [
                {
                    name: "Attendance Form",
                    href: "/form",
                },
                {
                    name: "Monthly Attendance",
                    href: "/monthly",
                },
                {
                    name: "Absent",
                    href: "/absent",
                },
                {
                    name: "ArriveLate / Out early",
                    href: "/late-or-early",
                },
                {
                    name: "Attendance list",
                    href: "/list",
                },
                {
                    name: "Attendance log",
                    href: "/log",
                },
            ],
        },
        {
            name: "Reports",
            href: "/reports",
            icon: PresentationChartLineIcon,
            subSidebar: [
                {
                    name: "Attendance report",
                    href: "/attendance",
                },
                {
                    name: "Leave report",
                    href: "/leave",
                },
                {
                    name: "New attendance report",
                    href: "/new-attendance",
                },
                {
                    name: "Outcome report",
                    href: "/outcome",
                },
            ],
        },
        {
            name: "Salary",
            href: "/salary",
            icon: SalaryIcon,
            subSidebar: [],
        },
    ];
    const segments = useSelectedLayoutSegments();
    const option = SideBarOps.find((opt) => opt.href == "/" + segments[0]);
    const subOption = option?.subSidebar.find(
        (subOpt) => subOpt.href == "/" + segments[1]
    );
    return (
        <main className=" flex bg-red-100 flex-row">
            <SideBar mode={mode} setMode={setMode} SideBarOps={SideBarOps} />
            <div
                className={
                    "flex flex-col absolute min-h-[calc(100%-3.5rem)] right-0 top-14 overflow-y duration-300 -z-10 " +
                    (mode == SideBarMode.Large
                        ? "w-[calc(100%-14rem)]"
                        : "w-[calc(100%-56px)]")
                }
            >
                {option?.href !== "/dashboard" && (
                    <TraceBar option={option} subOption={subOption} />
                )}
                <div className="flex flex-col flex-1">{children}</div>
                <Footer />
            </div>
        </main>
    );
};

export default Main;
