"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SideBarMode } from "./sideBar";
import { signOut, useSession } from "next-auth/react";

function Header({
    mode,
    setMode,
}: {
    mode: SideBarMode;
    setMode: Dispatch<SetStateAction<SideBarMode>>;
}) {
    const logOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        await signOut({
            callbackUrl: "/",
            redirect: true,
        });
    };
    const options = [
        { name: "Personal Information" },
        { name: "Attendance log" },
        { name: "Absent request" },
        { name: "Salary" },
        { name: "Log out", callback: logOut },
    ];
    const [visible, setVisible] = useState(false);
    const pressMenu = () => {
        switch (mode) {
            case SideBarMode.Large: {
                setMode(SideBarMode.Small);
                break;
            }
            case SideBarMode.Small: {
                setMode(SideBarMode.Large);
                break;
            }
        }
    };

    const { data: session } = useSession();
    const url = session?.user.avatarImage;

    return (
        <div className=" w-full bg-bar flex justify-between h-14 items-center px-3 fixed right-0 z-10">
            <div className="flex justify-center items-center gap-3">
                <MenuButton mode={mode} pressMenu={pressMenu} />
                <h3 className="text-white text-sm font-extrabold uppercase">
                    <a href="/dashboard">Human resource management</a>
                </h3>
            </div>
            <div className="flex items-center">
                <Image
                    className="relative dark:drop-shadow-[1_1_1.3rem_#ffffff70] dark:invert mr-8 "
                    src="/assets/icons/notice.svg"
                    alt="NoticeLogo"
                    width={24}
                    height={24}
                    priority
                />
                <span className=" font-medium text-sm text-white line-clamp-1">
                    {session?.user.name}
                </span>
                <img
                    src={url}
                    alt="User's avatar"
                    className="w-8 h-8 object-cover rounded-full mx-3"
                />
                <button onClick={() => setVisible(!visible)}>
                    <Image
                        className="relative dark:drop-shadow-[1_1_1.3rem_#ffffff70] dark:invert transform transition-all ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md rounded-full"
                        src="/assets/icons/dropdown.svg"
                        alt="dropdown"
                        width={16}
                        height={16}
                        priority
                    />
                </button>
                <div
                    onBlur={() => setVisible(false)}
                    className={`absolute w-60 py-2 bg-white self-start right-2 top-12 border rounded-sm border-slate-300 flex flex-col transition-all duration-300 origin-top ${
                        visible
                            ? "opacity-100"
                            : " opacity-0 invisible scale-y-0"
                    }`}
                >
                    {options.map((option) => (
                        <button
                            key={option.name}
                            className={` h-[60px] hover:bg-[#73A2996B] w-full text-start px-4 text-sm font-normal`}
                            onClick={option.callback}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Header;

const MenuButton = ({
    mode,
    pressMenu,
}: {
    mode: SideBarMode;
    pressMenu: () => void;
}) => {
    return (
        <button className="group " onClick={pressMenu}>
            <div
                className={
                    "relative flex overflow-hidden items-center justify-center rounded-full w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-8 ring-opacity-30 duration-200 shadow-md " +
                    (mode == SideBarMode.Large && "group-ring-4")
                }
            >
                <div
                    className={
                        "flex flex-col justify-between w-[12px] h-[12px] transform transition-all duration-300 origin-center overflow-hidden " +
                        (mode == SideBarMode.Large &&
                            "rotate-180 -translate-x-1.5")
                    }
                >
                    <div
                        className={
                            "bg-white h-[2px] transform transition-all duration-300 origin-left delay-150 " +
                            (mode == SideBarMode.Large
                                ? "rotate-[42deg] w-2/3"
                                : "w-5")
                        }
                    ></div>
                    <div
                        className={
                            "bg-white h-[2px] w-5 rounded transform transition-all duration-300 " +
                            (mode == SideBarMode.Large && "translate-x-10")
                        }
                    ></div>
                    <div
                        className={
                            "bg-white h-[2px] transform transition-all duration-300 origin-left delay-150 " +
                            (mode == SideBarMode.Large
                                ? "w-2/3 -rotate-[42deg]"
                                : "w-5")
                        }
                    ></div>
                </div>
            </div>
        </button>
    );
};
