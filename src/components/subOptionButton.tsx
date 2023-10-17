import { SideBarOptionType, SubSidebar } from "./optionButton";
import { SideBarMode } from "./sideBar";

const SubOptionButton = ({
    pressSubOption,
    isSubCurrent,
    subOption,
    option,
    sidebarMode,
}: {
    pressSubOption: (option: SideBarOptionType, subOption: SubSidebar) => void;
    isSubCurrent: (option: SideBarOptionType, subOption: SubSidebar) => boolean;
    subOption: SubSidebar;
    option: SideBarOptionType;
    sidebarMode: SideBarMode;
}) => {
    return (
        <li>
            <button
                onClick={() => pressSubOption(option, subOption)}
                className={
                    " hover:border-cyan-300 group flex p-1 text-sm leading-6 font-semibold items-center justify-between w-full border-l-2  hover:drop-shadow-[1px_2px_3px_rgba(255,255,255, 1)] hover:text-cyan-400 + " +
                    (isSubCurrent(option, subOption)
                        ? "  text-cyan-400 border-cyan-300 "
                        : "text-white ") +
                    (sidebarMode == SideBarMode.Small
                        ? " absolute "
                        : " relative ")
                }
            >
                {subOption.name}
            </button>
        </li>
    );
};

export default SubOptionButton;
