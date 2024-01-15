"use client";
import { Skeleton } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";
import { Tenor_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const tenor_sans = Tenor_Sans({ subsets: ["latin"], weight: "400" });

type dataItem = {
  totalEmployees: number;
  onTimeEmployees: number;
  lateEmployees: number;
  date: string;
};

function StackChart() {
  const axiosPrivate = useAxiosPrivate();
  const today = new Date();
  const [labels, setLabels] = useState<string[]>([]);
  const [onTime, setOnTime] = useState<number[]>([]);
  const [late, setLate] = useState<number[]>([]);
  const [absent, setAbsent] = useState<number[]>([]);
  const barThickness = 10;
  const options = {
    plugins: {
      title: {
        display: false,
        text: "Chart.js Bar Chart - Stacked",
      },
      legend: {
        align: "end",
        labels: {
          useBorderRadius: true,
          borderRadius: 5,
        },
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
  const data = {
    labels,
    datasets: [
      {
        label: "Late",
        data: late,
        backgroundColor: "#FFA600CC",
        borderWidth: 1,
        borderRadius: [10],
      },
      {
        label: "On Time",
        data: onTime,
        backgroundColor: "#29AB91",
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: "Absent",
        data: absent,
        backgroundColor: "#FF5630CC",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosPrivate.get<dataItem[]>(
          `/attendanceEmployee/${today.getMonth() + 1}/${today.getFullYear()}`
        );
        const reverse = res.data.reverse();
        let tempLabels: string[] = [];
        let tempOnTime: number[] = [];
        let tempLate: number[] = [];
        let tempAbsent: number[] = [];
        reverse.map((day) => {
          const days = new Date(day.date);
          if(today >= days)
          {
            tempLabels.push(format(new Date(day.date), "dd"));
            tempOnTime.push((day.onTimeEmployees * 100) / day.totalEmployees);
            tempLate.push((day.lateEmployees * 100) / day.totalEmployees);
            tempAbsent.push(
              ((day.totalEmployees - day.lateEmployees - day.onTimeEmployees) *
                100) /
                day.totalEmployees
            );
          }
        });
        setLabels(tempLabels);
        setOnTime(tempOnTime);
        setLate(tempLate);
        setAbsent(tempAbsent);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex flex-col flex-grow border border-blue-700 rounded-xl bg-white dark:bg-dark max-lg:h-[400px]">
      <h1
        className={`self-left ml-3 my-4 text-xl font-medium text-black dark:text-button ${tenor_sans.className}`}
      >
        Attendance statistic
      </h1>
      <div
        className={`flex flex-1 pb-3 items-center justify-start ${
          !labels.length && "justify-center"
        }`}
      >
        {labels.length ? (
          <div className="w-[97%] h-[85%] overflow-x-scroll overflow-y-hidden ">
            <Bar options={options} data={data} />
          </div>
        ) : (
          <Skeleton className="w-[97%] h-[85%] rounded-md" />
        )}
      </div>
    </div>
  );
}

export default StackChart;
