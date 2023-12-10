import { CircularProgress } from "@nextui-org/react";
import React from "react";
import { TrendUpIcon } from "src/svgs";

function CircleProgress({
    percentage,
    color,
    label,
    value,
    incOrDec,
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
    value?: string;
    incOrDec?: number;
}) {
    // const [percentage, setPercentage] = React.useState(74);

    return (
        <div className="flex h-36 flex-1 min-w-fit flex-row border border-blue-700 rounded-xl px-6 items-center bg-white">
            <div className="flex flex-1 md:flex-col gap-2 flex-row items-center lg:items-start justify-around">
                <p className="font-medium text-sm text-[#B2B2B2]">{label}</p>
                <p className="font-medium text-2xl text-black mb-3 sm:mb-0">
                    {value}
                </p>
                {incOrDec && incOrDec >= 0 && (
                    <div className="flex ">
                        <TrendUpIcon fill="#29AB91" />
                        <span className="font-medium text-xs">
                            +{incOrDec.toFixed(3)}% Inc
                        </span>
                    </div>
                )}
                {incOrDec && incOrDec < 0 && (
                    <div className="flex ">
                        <div className=" -scale-y-100">
                            <TrendUpIcon fill="#FF5630" />
                        </div>
                        <span className="font-medium text-xs">
                            {incOrDec.toFixed(3)}% Dec
                        </span>
                    </div>
                )}
            </div>
            <CircularProgress
                classNames={{
                    indicator: color == undefined && "stroke-[#38B6FF]",
                }}
                aria-label="Loading..."
                size="lg"
                value={percentage}
                color={color}
                showValueLabel={true}
            />
        </div>
    );
}

export default CircleProgress;
