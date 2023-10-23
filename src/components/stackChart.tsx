import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function StackChart() {
    const options = {
        plugins: {
            title: {
                display: false,
                text: "Chart.js Bar Chart - Stacked",
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    drawOnChartArea: false,
                },
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
    ];
    const data = {
        labels,
        datasets: [
            {
                label: "Dataset 1",
                data: labels.map(() => -300),
                backgroundColor: "rgb(255, 99, 132)",
                borderWidth: 1,
                borderRadius: [10],
            },
            {
                label: "Dataset 2",
                data: labels.map(() => -121),
                backgroundColor: "rgb(75, 192, 192)",
                borderWidth: 1,
                borderRadius: 10,
            },
            {
                label: "Dataset 3",
                data: labels.map(() => 100),
                backgroundColor: "rgb(53, 162, 235)",
                borderWidth: 1,
                borderRadius: 10,
            },
        ],
    };
    return (
        <div className="flex flex-1 border border-blue-700 rounded-xl">
            <Bar options={options} data={data} />
        </div>
    );
}

export default StackChart;
