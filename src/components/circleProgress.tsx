import { CircularProgress } from "@nextui-org/react";
import React from "react";
import { TrendUpIcon } from "src/svgs";

function CircleProgress({
    percentage,
    color,
    label,
}: {
    percentage?: number;
    color:
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
        | undefined;
    label?: string;
}) {
    const [value, setValue] = React.useState(74);

    return (
        <div className="flex h-36 flex-1 min-w-fit flex-row border border-blue-700 rounded-xl px-6 items-center bg-white">
            <div className="flex flex-1 md:flex-col gap-2 flex-row items-center lg:items-start justify-around">
                <p className="font-medium text-sm text-[#B2B2B2]">{label}</p>
                <p className="font-medium text-2xl text-black mb-3 sm:mb-0">
                    5672
                </p>
                <div className="flex ">
                    <TrendUpIcon fill="#29AB91" />
                    <span className="font-medium text-xs">+14% Inc</span>
                </div>
            </div>
            <CircularProgress
                aria-label="Loading..."
                size="lg"
                value={value}
                color={color}
                showValueLabel={true}
            />
        </div>
    );
}

export default CircleProgress;
