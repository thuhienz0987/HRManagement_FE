import { Pie } from "react-chartjs-2";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
    label,
    dataset,
    title,
}: {
    label: string[];
    dataset: number[];
    title?: string;
}) {
    const options = {
        plugins: {
            title: {
                display: false,
                text: "Custom Chart Title",
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        // label: {},
    };
    const data = {
        labels: label,
        datasets: [
            {
                label: "# of Votes",
                data: dataset,
                backgroundColor: ["#FFA600", "#FF5630", "#FEFAEE", "73A299"],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="">
            <Pie data={data} options={options} />
            <p className="text-[#2C3D3A] font-normal text-xl">{title}</p>
        </div>
    );
}
