"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
  ColumnEnum,
  ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import { format, parseISO, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import StackChart from "src/components/stackChart";
import { User, Department } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";

type Employee = User & {
  createdAt: string;
  department?: string;
  status: string;
};

type dDepartment = Department & {
  value: string;
};

const EmployeeList = () => {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const [employees, setEmployees] = useState<Employee[]>();
  const [departments, setDepartments] = useState<dDepartment[]>();
  const [sortedDept, setSortedDept] = useState<string>();
  const [sortedStatus, setSortedStatus] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>();
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await axiosPrivate.get<Employee[]>("/all-user", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        res.data.map((employee) => {
          employee.createdAt = format(
            parseISO(employee.createdAt),
            "dd/MM/yyyy"
          );
          employee.department = employee?.departmentId?.name;
          employee.status = employee.dayOff ? "Lay Off" : "Working";
        });
        setEmployees(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    const getDepartments = async () => {
      try {
        const res = await axiosPrivate.get<dDepartment[]>("/departments");
        res.data.map((dept) => (dept.value = dept.name));
        setDepartments(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getDepartments();
    getEmployees();
  }, []);
  const statusFilterOps = [
    { name: "Working", value: "Working" },
    { name: "Lay Off", value: "Lay Off" },
  ];
  const columns: ColumnType[] = [
    {
      title: "No",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Employee Code",
      type: ColumnEnum.textColumn,
      key: "code",
    },
    {
      title: "Full Name",
      type: ColumnEnum.textColumn,
      key: "name",
    },
    {
      title: "Started Date",
      type: ColumnEnum.textColumn,
      key: "createdAt",
    },
    {
      title: "Department",
      type: ColumnEnum.textColumn,
      key: "department",
    },
    {
      title: "Status",
      type: ColumnEnum.filterColumn,
      key: "status",
      filterOptions: statusFilterOps,
      setFilterVal: setSortedStatus,
    },
    {
      title: "Action",
      type: ColumnEnum.functionColumn,
      key: "action",
    },
  ];

  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const rows = () => {
    let sortedEmp = employees;
    if (searchQuery) {
      sortedEmp = sortedEmp?.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortedDept) {
      sortedEmp = sortedEmp?.filter(
        (emp) => emp?.departmentId?.name == sortedDept
      );
    }
    if (sortedStatus) {
      sortedEmp = sortedEmp?.filter((emp) => emp?.status == sortedStatus);
    }
    return sortedEmp;
  };
  const moveToAddNew = () => {
    return router.push("/employee/add-employee");
  };

  const handleView = (id: string) => {
    router.push("/account/profile?id=" + id);
  };
  const handleEdit = (id: string) => {
    router.push("/account/edit-profile?id=" + id);
  };
  return (
    <div className="flex flex-1 flex-col px-[4%] pb-4 rounded gap-y-9">
      <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
        <div className="w-[95%] self-center flex flex-col">
          <div className="w-full flex flex-row gap-3 items-center">
            <h3 className="text-[26px] font-semibold text-[#2C3D3A] dark:text-button">
              Employee list
            </h3>
            <CustomDropdown
              placeholder="Select department"
              additionalStyle="flex-1 h-full"
              buttonStyle="bg-white border h-[39px] dark:bg-[#3b3b3b]"
              options={departments}
              onSelect={setSortedDept}
              value={sortedDept}
            />
            <div className="flex gap-3">
              <RegularButton
                label="add new"
                callback={moveToAddNew}
                additionalStyle="min-w-[100px]"
              />
            </div>
          </div>
          <TableFirstForm
            columns={columns}
            rows={rows()}
            viewFunction={handleView}
            editFunction={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
