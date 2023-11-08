import { ArrowIcon, BackIcon } from "src/svgs";
import { SideBarOptionType, SubSidebar } from "./optionButton";

const TraceBar = ({
    option,
    subOption,
}: {
    option: SideBarOptionType | undefined;
    subOption: SubSidebar | undefined;
}) => {
    return (
        <div className="flex my-6 px-[4%] w-full justify-between items-center">
            <button
                className={
                    "relative flex overflow-hidden items-center justify-center w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md group-ring-3 bg-[#2C3D3A1a] rounded-full"
                }
            >
                <BackIcon width="16" height="14" />
            </button>
            <div className="flex items-center gap-3 ">
                <button>
                    <p
                        className={`text-sm font-normal hover:underline ${
                            subOption ? "text-[#7E8CAC]" : "text-[#2C3D3A]"
                        }`}
                    >
                        {option?.name}
                    </p>
                </button>
                {subOption && <ArrowIcon width="12" height="12" />}
                <button>
                    <p className=" text-sm font-normal hover:underline text-[#2C3D3A]">
                        {subOption?.name}
                    </p>
                </button>
            </div>
        </div>
    );
};

export default TraceBar;
