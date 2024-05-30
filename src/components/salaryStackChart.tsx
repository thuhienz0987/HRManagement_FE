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
  firmSalaries: number;
  officeSalaries: number;
  salesSalaries: number;
  productionSalaries: number;
  month: string;
};

function SalaryStackChart() {
  const axiosPrivate = useAxiosPrivate();
  const today = new Date();
  const [labels, setLabels] = useState<string[]>([]);
  const [office, setOffice] = useState<number[]>([]);
  const [sales, setSales] = useState<number[]>([]);
  const [production, setProduction] = useState<number[]>([]);
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
    indexAxis: 'x', // Add this line to switch to horizontal bar chart
    barPercentage: 0.2, // Adjust the spacing of the bars
    categoryPercentage: 0.9, // Adjust the spacing between categories
    barThickness: 100,
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
        label: "Office",
        data: office,
        backgroundColor: "#FFA600CC",
        borderWidth: 1,
        borderRadius: [10],
      },
      {
        label: "Sales",
        data: sales,
        backgroundColor: "#29AB91",
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: "Production",
        data: production,
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
          `/statisticSalariesByYear/${today.getFullYear()}`
        );
        
        // const reverse = res.data.reverse();
        let tempLabels: string[] = [];
        let tempOffice: number[] = [];
        let tempSales: number[] = [];
        let tempProduction: number[] = [];
        console.log(res.data)
        res.data.map((month) => {
          tempLabels.push(`${month.month}/24`);
          tempOffice.push((month.officeSalaries / month.firmSalaries) * 100 );
          tempSales.push((month.salesSalaries / month.firmSalaries) * 100 );
          tempProduction.push((month.productionSalaries / month.firmSalaries) * 100);
        });
        setLabels(tempLabels);
        setOffice(tempOffice);
        setSales(tempSales);
        setProduction(tempProduction);
        console.log({labels});
        console.log({office});
        console.log({sales});
        console.log({production});
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
        Salary statistic
      </h1>
      <div
        className={`flex flex-1 pb-3 items-center justify-start ${
          !labels.length && "justify-center"
        }`}
      >
        {labels.length ? (
          <div className="w-[97%] h-[85%] overflow-x-scroll overflow-y-hidden ">
            <Bar options={options} data={data}/>
          </div>
        ) : (
          <Skeleton className="w-[97%] h-[85%] rounded-md" />
        )}
      </div>
    </div>
  );
}

export default SalaryStackChart;
