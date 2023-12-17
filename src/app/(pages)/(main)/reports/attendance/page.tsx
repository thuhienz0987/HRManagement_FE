"use client";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import PieChart from "src/components/pieChart";

type NewEmpResponse = {
  departmentName: string;
  employeeRatio: number;
};

const Reports = () => {
  const axiosPrivate = useAxiosPrivate();
  const [newEmpLabel, setNewEmpLabel] = useState<string[]>();
  const [newEmpRatio, setNewEmpRatio] = useState<number[]>();
  useEffect(() => {
    const getNewEmpRatio = async () => {
      try {
        const res = await axiosPrivate.get<NewEmpResponse[]>(
          "/departmentNewEmployeeRatio/10/2023"
        );
        let label: string[] = [];
        let ratio: number[] = [];
        res.data.forEach((dept) => {
          label.push(dept.departmentName);
          ratio.push(dept.employeeRatio);
        });
        setNewEmpLabel(label);
        setNewEmpRatio(ratio);
      } catch (e) {
        console.log({ e });
      }
    };
    getNewEmpRatio();
  }, []);
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[90%] self-center bg-white border border-blue-600 rounded-md">
        {newEmpLabel && newEmpRatio && (
          <PieChart
            dataset={newEmpRatio}
            label={newEmpLabel}
            title="New employees"
          />
        )}
        {newEmpLabel && newEmpRatio && (
          <PieChart
            dataset={newEmpRatio}
            label={newEmpLabel}
            title="New employees"
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
