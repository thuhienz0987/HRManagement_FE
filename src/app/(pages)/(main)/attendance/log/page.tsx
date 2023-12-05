"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../../../../../@/components/ui/select";
import { format, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import StackChart from "src/components/stackChart";
import { Department, User } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";

type EmployeeAttendance = User & {
    user: User;
    totalOvertimeHours: number;
    totalWorkingDays: number;
};

type dDepartment = Department & {
    value: string;
};

const Log = () => {
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
            title: "Working day",
            type: ColumnEnum.textColumn,
            key: "totalWorkingDays",
        },
        {
            title: "Overtime",
            type: ColumnEnum.textColumn,
            key: "totalOvertimeHours",
        },
        {
            title: "Status",
            type: ColumnEnum.textColumn,
            key: "status",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const today = startOfToday();
    const [employeeAttendances, setEmployeeAttendances] =
        useState<EmployeeAttendance[]>();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [sortedDept, setSortedDept] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getEmployees = async (month: number, year: number) => {
            try {
                const res = await axiosPrivate.get<EmployeeAttendance[]>(
                    `/attendancesByMonth_total/${month}/${year}`,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                res.data.map((employee) => {
                    employee.code = employee.user.code;
                    employee.name = employee.user.name;
                    employee.departmentId = employee.user.departmentId;
                });
                console.log(res.data);
                setEmployeeAttendances(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                res.data.map((dept) => (dept.value = dept.name));
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getEmployees(currentMonth, today.getFullYear());
    }, []);
    const rows = () => {
        let sortedEmp = employeeAttendances;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (emp) =>
                    emp.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    emp.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (emp) => emp?.departmentId?.name == sortedDept
            );
        }
        return sortedEmp;
    };
    const handleSearch = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] pb-4 rounded gap-y-9">
            <div className=" flex w-full gap-x-7 items-end ">
                <Input
                    className="rounded w-auto flex-1"
                    classNames={{
                        inputWrapper: "bg-white border",
                    }}
                    radius="sm"
                    variant="bordered"
                    key={"a"}
                    type="email"
                    placeholder="Search"
                    labelPlacement={"outside"}
                    endContent={
                        <div className="bg-black p-1 rounded opacity-80">
                            <SearchIcon />
                        </div>
                    }
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <CustomDropdown
                    placeholder="Select department"
                    additionalStyle="flex-1 h-full"
                    buttonStyle="bg-white border h-[39px]"
                    options={departments}
                    onSelect={setSortedDept}
                    value={sortedDept}
                />
            </div>
            <div className="flex flex-1 flex-col bg-white w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex flex-col">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h3 className=" text-[26px] font-semibold text-[#2C3D3A]">
                            Attendance log
                        </h3>
                        <div className="flex gap-3">
                            {/* <CustomDropdown
                                placeholder="Month"
                                additionalStyle="min-w-[100px]"
                                buttonStyle="bg-white border"
                            /> */}
                        </div>
                    </div>
                    <TableFirstForm columns={columns} rows={rows()} />
                </div>
            </div>
            <StackChart />
        </div>
    );
};

export default Log;
