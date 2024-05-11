import { SideBarOptionType, SubSidebar } from "./optionButton";
import { SideBarMode } from "./sideBar";

const SubOptionButton = ({
    pressSubOption,
    isSubCurrent,
    subOption,
    option,
    sidebarMode,
    lor,
}: {
    pressSubOption: (option: SideBarOptionType, subOption: SubSidebar) => void;
    isSubCurrent: (option: SideBarOptionType, subOption: SubSidebar) => boolean;
    subOption: SubSidebar;
    option: SideBarOptionType;
    sidebarMode: SideBarMode;
    lor: string;
}) => {
    return (
        <li>
            <button
                onClick={() => pressSubOption(option, subOption)}
                className={
                    " hover:text-[#C89E31] group flex p-1 text-sm leading-6 font-semibold items-center w-full border-l-2  hover:drop-shadow-[1px_2px_3px_rgba(255,255,255, 1)] hover:text-[#C89E31] + " +
                    (isSubCurrent(option, subOption)
                        ? "  text-[#C89E31] border-[#C89E31] "
                        : "text-white ") +
                    (lor == "right" && " justify-end ")
                }
            >
                {subOption.name}
            </button>
        </li>
    );
};

export default SubOptionButton;
