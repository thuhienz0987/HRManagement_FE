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
    const barThickness = 10;
    const options = {
        plugins: {
            title: {
                display: false,
                text: "Chart.js Bar Chart - Stacked",
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                grid: {
                    drawOnChartArea: false,
                },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    callback: (value: number, index: number, values: any[]) => {
                        if (value <= 100) return `${value}%`;
                    },
                },
                grace: 0,
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
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const data = {
        labels,
        datasets: [
            {
                label: "Dataset 1",
                data: labels.map(() => 30),
                backgroundColor: "#FFA600CC",
                borderWidth: 1,
                borderRadius: [10],
                barThickness: barThickness,
            },
            {
                label: "Dataset 2",
                data: labels.map(() => 10),
                backgroundColor: "#2C3D3A",
                borderWidth: 1,
                borderRadius: 10,
                barThickness: barThickness,
            },
            {
                label: "Dataset 3",
                data: labels.map(() => 60),
                backgroundColor: "#FF5630CC",
                borderWidth: 1,
                borderRadius: 10,
                barThickness: barThickness,
            },
        ],
    };

    useEffect(() => {
        function handleResize() {
            console.log(
                "resized to: ",
                window.innerWidth,
                "x",
                window.innerHeight
            );
        }

        window.addEventListener("resize", handleResize);
    });
    return (
        <div className="flex flex-grow border border-blue-700 rounded-xl lg:h-96 md:h-64 h-48 bg-white">
            <Bar options={options} data={data} />
        </div>
    );
}

export default StackChart;
