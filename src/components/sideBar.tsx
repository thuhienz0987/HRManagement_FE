"use client";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import OptionButton, { SideBarOptionType, SubSidebar } from "./optionButton";
import { useRouter } from "next13-progressbar";
import SubOptionButton from "./subOptionButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../@/components/ui/hover-card";

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
    mode == SideBarMode.Small && setIsOpenSubList(initList);
  }, [mode]);

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
    if (option.subSidebar.length == 0) router.push(option.href);
    if (mode == SideBarMode.Small) return;
    if (!isOpenSubList.includes(option.name))
      setIsOpenSubList([...isOpenSubList, option.name]);
    if (isOpenSubList.includes(option.name)) {
      const newList = isOpenSubList.filter((name) => option.name !== name);
      setIsOpenSubList(newList);
    }
    // isActive !== option.href
    //     ? setIsActive(option.href)
    //     : setIsActive(pathname);
  };

  const pressSubOption = (option: SideBarOptionType, subOption: SubSidebar) => {
    if (subOption.searchParams)
      return router.push(option.href + subOption.href + subOption.searchParams);
    return router.push(option.href + subOption.href);
  };

  const hasOpenedSubList = (option: SideBarOptionType) => {
    return isOpenSubList.includes(option.name);
  };

  return (
    <div
      className={
        "fixed h-[calc(100vh-3.5rem)] bottom-0 invisible md:visible transition opacity-0 md:opacity-100 duration-100 "
      }
    >
      <div
        className={
          "flex h-full flex-col duration-300 ease-in-out " +
          (mode == SideBarMode.Large ? "w-56" : "w-[56px]")
        }
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden bg-bar dark:bg-bar_dark pb-4 border-r-2">
          <nav className="flex flex-1 flex-col py-1 gap-y-7 ">
            <ul role="list" className=" mx-2 space-y-1">
              {SideBarOps.map((option) => (
                <div key={option.name}>
                  {option.isHidden == false && (
                    <li className="relative">
                      <HoverCard>
                        <HoverCardTrigger>
                          <OptionButton
                            option={option}
                            checkIsCurrent={isCurrent}
                            pressOption={pressOption}
                            sidebarMode={mode}
                            hasOpenedSubList={hasOpenedSubList}
                          />
                        </HoverCardTrigger>
                        {option.subSidebar.length &&
                        mode == SideBarMode.Large ? (
                          <ul
                            role="list"
                            className={
                              "  p-2 bg-[#46605B7F] dark:bg-[rgb(45,44,44)] rounded-b-md transition ease-in-out duration-1000" +
                              (hasOpenedSubList(option)
                                ? " translate-y-0 opacity-1 visible z-20 relative "
                                : " -translate-y-15 opacity-0 invisible -z-10 absolute ")
                            }
                          >
                            {option.subSidebar.map(
                              (subOption) =>
                                !subOption.isHidden && (
                                  <SubOptionButton
                                    key={subOption.name}
                                    option={option}
                                    subOption={subOption}
                                    pressSubOption={pressSubOption}
                                    isSubCurrent={isSubCurrent}
                                    sidebarMode={mode}
                                  />
                                )
                            )}
                          </ul>
                        ) : null}
                        {option.subSidebar.length &&
                        mode == SideBarMode.Small ? (
                          <HoverCardContent className=" w-60 ml-[5px] bg-white  ">
                            <ul
                              role="list"
                              className={
                                "  p-2 bg-[#2C3D3A] dark:bg-dark rounded-b-md transition ease-in-out duration-1000"
                                // (hasOpenedSubList(
                                //     option
                                // )
                                //     ? " translate-y-0 opacity-1 visible z-20 relative "
                                //     : " -translate-y-15 opacity-0 invisible -z-10 absolute ")
                              }
                            >
                              {option.subSidebar.map(
                                (subOption) =>
                                  !subOption.isHidden && (
                                    <SubOptionButton
                                      key={subOption.name}
                                      option={option}
                                      subOption={subOption}
                                      pressSubOption={pressSubOption}
                                      isSubCurrent={isSubCurrent}
                                      sidebarMode={mode}
                                    />
                                  )
                              )}
                            </ul>
                          </HoverCardContent>
                        ) : null}
                        {option.subSidebar.length == 0 &&
                        mode == SideBarMode.Small ? (
                          <HoverCardContent className="bg-white text-black text-sm leading-6 font-semibold items-center py-2 ml-[5px]">
                            {option.name}
                          </HoverCardContent>
                        ) : null}
                      </HoverCard>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
