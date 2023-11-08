"use client";
import Calendar from "src/components/calendar";
import CircleProgress from "src/components/circleProgress";
import StackChart from "src/components/stackChart";

const DashBoard = () => {
    return (
        <div className="flex flex-1 py-6 flex-col gap-y-10 md:px-10 px-3">
            <div className="flex gap-5 flex-col flex-wrap md:flex-row xl:flex-nowrap">
                <CircleProgress
                    label="Total employees"
                    percentage={100}
                    color="success"
                />
                <CircleProgress
                    label="Late employees"
                    percentage={70}
                    color="warning"
                />
                <CircleProgress
                    label="Absent employees"
                    percentage={30}
                    color="danger"
                />
            </div>
            <StackChart />
            <Calendar />
        </div>
    );
};

export default DashBoard;
