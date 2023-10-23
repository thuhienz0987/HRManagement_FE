"use client";
import Calendar from "src/components/calendar";
import CircleProgress from "src/components/circleProgress";
import StackChart from "src/components/stackChart";

const Home = () => {
    return (
        <div className="flex w-full px-20 py-6 flex-col gap-10">
            <div className="flex gap-x-5 flex-1">
                <CircleProgress />
                <CircleProgress />
                <CircleProgress />
            </div>
            <StackChart />
            <Calendar />
        </div>
    );
};

export default Home;
