import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { SideBarMode } from "./sideBar";
import { useState } from "react";

export type SideBarOptionType = {
    name: string;
    href: string;
    icon: any;
    subSidebar: SubSidebar[];
    isHidden: boolean;
};

export interface SubSidebar {
    name: string;
    href: string;
    searchParams?: string;
    isHidden?: boolean;
}
const OptionButton = ({
    option,
    pressOption,
    checkIsCurrent,
    sidebarMode,
    hasOpenedSubList,
}: {
    option: SideBarOptionType;
    pressOption: (option: SideBarOptionType) => void;
    checkIsCurrent: (option: SideBarOptionType) => boolean;
    sidebarMode: SideBarMode;
    hasOpenedSubList: (option: SideBarOptionType) => boolean;
}) => {
    function delay(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <button
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => pressOption(option)}
            className={
                (checkIsCurrent(option)
                    ? "bg-white text-black z-30 "
                    : "text-gray-200 hover:text-black hover:bg-gray-100 z-10 transition duration-150 ") +
                "group flex p-2 text-[13.5px] leading-6 font-semibold items-center justify-between w-full " +
                (option.subSidebar.length &&
                checkIsCurrent(option) &&
                sidebarMode == SideBarMode.Large
                    ? "rounded-t-md "
                    : "rounded-md ") +
                (checkIsCurrent(option) &&
                !hasOpenedSubList(option) &&
                sidebarMode == SideBarMode.Large
                    ? " rounded-md "
                    : " ") +
                (sidebarMode == SideBarMode.Small &&
                    !checkIsCurrent(option) &&
                    " hover:scale-110 ") +
                (sidebarMode == SideBarMode.Large &&
                    !checkIsCurrent(option) &&
                    " hover:scale-105 ")
            }
        >
            <div
                className={
                    "flex gap-x-3 " +
                    (!checkIsCurrent(option) &&
                        sidebarMode == SideBarMode.Large &&
                        "group-hover:pl-3")
                }
            >
                <option.icon
                    width="24"
                    height="24"
                    fill="none"
                    stroke={
                        checkIsCurrent(option) || isHovered ? "black" : "white"
                    }
                />
                <div
                    className={
                        "ease-in-out duration-200 " +
                        (sidebarMode == SideBarMode.Small
                            ? " -translate-x-3 opacity-0 absolute left-12"
                            : " translate-x-0 opacity-1 ")
                    }
                >
                    {option.name}
                </div>
            </div>

            {option.subSidebar.length && sidebarMode == SideBarMode.Large ? (
                <ChevronRightIcon
                    className={
                        "h-4 w-4 shrink-0 justify-self-end duration-300 group-hover:text-black" +
                        (checkIsCurrent(option)
                            ? " text-black rotate-90"
                            : " text-gray-200") +
                        (hasOpenedSubList(option) && "rounded-md rotate-90")
                    }
                />
            ) : null}
        </button>
    );
};

export default OptionButton;
