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
import { useTheme } from "next-themes";
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
  totalWorkTime: string;
  date: string;
};

function BarChart({ userId }: { userId: string }) {
  const { theme } = useTheme();
  const axiosPrivate = useAxiosPrivate();
  const today = new Date();
  const [labels, setLabels] = useState<string[]>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [bg, setBg] = useState<string[]>([]);
  const options = {
    plugins: {
      title: {
        display: false,
        text: "Chart.js Bar Chart - Stacked",
      },
      legend: {
        display: false,
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
        ticks: {
          color: theme === "light" ? "#00000080" : "#FFFFFF80",
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        grace: 0,
        grid: {
          color: theme === "light" ? "#00000020" : "#FFFFFF20",
        },
        ticks: {
          color: theme === "light" ? "#00000080" : "#FFFFFF80",
        },
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "Hours",
        data: hours,
        backgroundColor: bg,
        borderWidth: 1,
        borderRadius: [10],
      },
    ],
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosPrivate.get<dataItem[]>(
          `/attendanceWorkTimeADayInMonth/${
            today.getMonth() + 1
          }/${today.getFullYear()}/${userId}`
        );
        let tempLabels: string[] = [];
        let tempHours: number[] = [];
        let tempBgs: string[] = [];
        res.data.map((day) => {
          tempLabels.push(format(new Date(day.date), "dd"));
          tempHours.push(parseFloat(day.totalWorkTime));
          if (parseFloat(day.totalWorkTime) >= 8) tempBgs.push("#29AB91");
          if (parseFloat(day.totalWorkTime) < 8) tempBgs.push("#FFA600CC");
        });
        setLabels(tempLabels);
        setHours(tempHours);
        setBg(tempBgs);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  console.log({ theme });

  return (
    <div className="flex flex-col flex-grow border border-blue-700 rounded-xl bg-white dark:bg-dark max-lg:h-[400px]">
      <h1
        className={`self-left ml-3 my-4 text-xl font-medium text-black dark:text-white ${tenor_sans.className}`}
      >
        Working hours per day statistic
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

export default BarChart;
