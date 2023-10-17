"use client";
import {
    useSelectedLayoutSegment,
    useSelectedLayoutSegments,
    useRouter,
} from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OptionButton, { SideBarOptionType, SubSidebar } from "./optionButton";
import {
    HomeIcon,
    PresentationChartLineIcon,
    SalaryIcon,
    UserIcon,
} from "src/svgs";
import SubOptionButton from "./subOptionButton";

export enum SideBarMode {
    Large = "Large",
    Small = "Small",
    Hidden = "Hidden",
}

const SideBar = ({
    mode,
    setMode,
    SideBarOps,
}: {
    mode: SideBarMode;
    setMode: Dispatch<SetStateAction<SideBarMode>>;
    SideBarOps: SideBarOptionType[];
}) => {
    const segments = useSelectedLayoutSegments();
    const isActive = "/" + useSelectedLayoutSegment();
    const router = useRouter();
    const initList: string[] = [];
    const [isOpenSubList, setIsOpenSubList] = useState(initList);

    useEffect(() => {
        console.log(isOpenSubList);
    }, [isOpenSubList]);

    const isCurrent = (option: SideBarOptionType) => {
        if (isOpenSubList.includes(option.name)) return true;
        return option.href === isActive;
    };

    const isSubCurrent = (option: SideBarOptionType, subOption: SubSidebar) => {
        const subPath = segments[segments.length - 1];
        if ("/" + subPath === subOption.href) return true;
        return false;
        // console.log({ segment });
        // if is current and has child
        // if (isCurrent(option) && option.subSidebar.length)
        //     if (subOption.href === segment) return true;
        // return false;
    };

    const pressOption = (option: SideBarOptionType) => {
        if (option.subSidebar.length == 0) router.replace(option.href);
        if (!isOpenSubList.includes(option.name))
            setIsOpenSubList([...isOpenSubList, option.name]);
        if (isOpenSubList.includes(option.name)) {
            const newList = isOpenSubList.filter(
                (name) => option.name !== name
            );
            setIsOpenSubList(newList);
        }
        // isActive !== option.href
        //     ? setIsActive(option.href)
        //     : setIsActive(pathname);
    };

    const pressSubOption = (
        option: SideBarOptionType,
        subOption: SubSidebar
    ) => {
        router.replace(option.href + subOption.href);
    };

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

    return (
        <div
            className={
                "lg:fixed h-[calc(100%-3.5rem)] lg:flex lg:flex-col bottom-0 duration-300 ease-in-out  " +
                (mode == SideBarMode.Large ? "lg:w-56" : " lg:w-[56px]")
            }
        >
            <MenuButton mode={mode} pressMenu={pressMenu} />
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-700 pb-4 border-r-2">
                <nav className="flex flex-1 flex-col py-1 gap-y-7 ">
                    <ul role="list" className=" mx-2 space-y-1">
                        {SideBarOps.map((option) => (
                            <li key={option.name}>
                                <OptionButton
                                    option={option}
                                    checkIsCurrent={isCurrent}
                                    pressOption={pressOption}
                                    sidebarMode={mode}
                                />
                                {option.subSidebar.length ? (
                                    <ul
                                        role="list"
                                        className={
                                            "  p-2 bg-blue-600 rounded-b-md transition ease-in-out duration-1000 " +
                                            (isOpenSubList.includes(option.name)
                                                ? " translate-y-0 opacity-1 visible z-20 relative "
                                                : " -translate-y-15 opacity-0 invisible -z-10 absolute ")
                                        }
                                    >
                                        {option.subSidebar.map((subOption) => (
                                            <SubOptionButton
                                                option={option}
                                                subOption={subOption}
                                                pressSubOption={pressSubOption}
                                                isSubCurrent={isSubCurrent}
                                                sidebarMode={mode}
                                            />
                                        ))}
                                    </ul>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SideBar;

const MenuButton = ({
    mode,
    pressMenu,
}: {
    mode: SideBarMode;
    pressMenu: () => void;
}) => {
    return (
        <button className="absolute group -top-[44px] ml-3" onClick={pressMenu}>
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
