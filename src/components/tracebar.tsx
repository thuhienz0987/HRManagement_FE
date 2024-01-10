import { ArrowIcon, BackIcon } from "src/svgs";
import { SideBarOptionType, SubSidebar } from "./optionButton";
import { useTheme } from "next-themes";

const TraceBar = ({
  option,
  subOption,
}: {
  option: SideBarOptionType | undefined;
  subOption: SubSidebar | undefined;
}) => {
  const { theme } = useTheme();
  return (
    <div className="flex my-6 px-[4%] w-full justify-end items-center">
      {/* <button
                className={
                    "relative flex overflow-hidden items-center justify-center w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md group-ring-3 bg-[#2C3D3A1a] rounded-full"
                }
            >
                <BackIcon width="16" height="14" />
            </button> */}
      <div className="flex items-center gap-3 ">
        <button>
          <p
            //hover:underline
            className={`text-sm font-normal  ${
              subOption
                ? "text-[#7E8CAC] dark:text-[#C89E3180]"
                : "text-[#2C3D3A] dark:text-button"
            }`}
          >
            {option?.name}
          </p>
        </button>
        {subOption && (
          <ArrowIcon
            width="12"
            height="12"
            fill={theme === "light" ? "#2C3D3A" : "#C89E31"}
          />
        )}
        <button>
          <p
            //hover:underline
            className=" text-sm font-normal  text-[#2C3D3A] dark:text-button"
          >
            {subOption?.name}
          </p>
        </button>
      </div>
    </div>
  );
};

export default TraceBar;
