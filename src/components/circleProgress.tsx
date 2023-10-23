import { CircularProgress } from "@nextui-org/react";
import React from "react";
import { TrendUpIcon } from "src/svgs";

function CircleProgress() {
    const [value, setValue] = React.useState(74);

    return (
        <div className="flex h-36 flex-1 flex-row border border-blue-700 rounded-xl px-6 items-center">
            <div className="flex flex-1 flex-col gap-2">
                <p className="font-medium text-sm text-[#B2B2B2]">
                    Total Employees
                </p>
                <p className="font-medium text-2xl text-black mb-3">5672</p>
                <div className="flex ">
                    <TrendUpIcon fill="#29AB91" />
                    <span className="font-medium text-xs">+14% Inc</span>
                </div>
            </div>
            <CircularProgress
                aria-label="Loading..."
                size="lg"
                value={value}
                color="success"
                showValueLabel={true}
            />
        </div>
    );
}

export default CircleProgress;
