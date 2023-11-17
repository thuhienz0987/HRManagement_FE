import React from "react";
import { useEffect, useRef, useState } from "react";
import { Tenor_Sans, Telex } from "next/font/google";
import { ColorCalendarIcon } from "src/svgs";

const tenor_sans = Tenor_Sans({ subsets: ["latin"], weight: "400" });
const telex = Telex({ subsets: ["latin"], weight: "400" });

function DayCounter({
    width,
    height,
    fill,
    stroke,
}: {
    width?: string;
    height?: string;
    fill?: string;
    stroke?: string;
}) {
    const imgPath = "../../public/assets/images/calendar.png";
    const ref = useRef<HTMLDivElement>(null);
    const [divWidth, setWidth] = useState(0);
    useEffect(() => {
        setWidth(ref.current?.offsetWidth || 0);
    }, []);
    return (
        <div
            className="flex flex-1 flex-col border bg-bar p-2 rounded-xl overflow-hidden self-center w-full items-center justify-center"
            ref={ref}
        >
            <h3
                className={`self-center my-4 text-xl font-medium text-[#C89E31] ${tenor_sans.className}`}
            >
                Available Paid Leave
            </h3>
            <div className="flex relative justify-center">
                <ColorCalendarIcon
                    width={divWidth.toString()}
                    height={divWidth.toString()}
                />
                <p
                    className={`absolute self-center mt-6 text-8xl font-semibold text-black ${telex.className}`}
                >
                    10
                </p>
            </div>

            {/* <div className="flex flex-1 justify-center bg-[url('../../public/assets/images/calendar.png')] bg-no-repeat items-center font-medium text-8xl w-full">
                10
            </div> */}
        </div>
    );
}

export default DayCounter;
