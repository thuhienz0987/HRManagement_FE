"use client";
import { Input } from "@nextui-org/react";
import { format, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import { Tenor_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import PieChart from "src/components/pieChart";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import allowRows from "src/helper/allowRoles";
import getMonthsBetweenDates from "src/helper/getMonthBetweenDays";
import { SearchIcon } from "src/svgs";
import { Department, User } from "src/types/userType";
import XLSX from "sheetjs-style";
import { Salary } from "src/types/salaryTypes";

type AttendancePercentageResponse = {
    result: [
        {
            departmentName: string;
            departmentAttendances: number;
            departmentPercent: number;
        }
    ];
    totalAmount: number;
};

type EmployeeAttendance = User & {
    user: User;
    totalOvertimeHours: number;
    totalWorkingDays: number;
};

type dDepartment = Department & {
    value: string;
};

type dSalary = Salary & {
    departmentName: string;
    employeeCode: string;
    employeeName: string;
    month: string;
};

const tenor_sans = Tenor_Sans({ subsets: ["latin"], weight: "400" });

const SalaryReports = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: session } = useSession();
    const [attendanceLabel, setAttendanceLabel] = useState<string[]>();
    const [attendanceRatio, setAttendanceRatio] = useState<number[]>();
    const [attendanceQuantity, setAttendanceQuantity] = useState<number[]>();
    const [totalAttendance, setTotalAttendance] = useState<number>();
    const columns: ColumnType[] = [
        {
            title: "Month",
            type: ColumnEnum.textColumn,
            key: "month",
        },
        {
            title: "Salary for present",
            type: ColumnEnum.textColumn,
            key: "dayMoney",
        },
        {
            title: "Allowance",
            type: ColumnEnum.textColumn,
            key: "allowanceAmount",
        },
        {
            title: "Bonus",
            type: ColumnEnum.textColumn,
            key: "bonusMoney",
        },
        {
            title: "Salary",
            type: ColumnEnum.textColumn,
            key: "totalSalary",
        },
        {
            title: "Received Date",
            type: ColumnEnum.textColumn,
            key: "createdAt",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    // const columns: ColumnType[] = [
    //     {
    //         title: "No",
    //         type: ColumnEnum.indexColumn,
    //         key: "no",
    //     },
    //     {
    //         title: "Employee Code",
    //         type: ColumnEnum.textColumn,
    //         key: "code",
    //     },
    //     {
    //         title: "Full Name",
    //         type: ColumnEnum.textColumn,
    //         key: "name",
    //     },
    //     {
    //         title: "Working day",
    //         type: ColumnEnum.textColumn,
    //         key: "totalWorkingDays",
    //     },
    //     {
    //         title: "Overtime",
    //         type: ColumnEnum.textColumn,
    //         key: "totalOvertimeHours",
    //     },
    //     {
    //         title: "Action",
    //         type: ColumnEnum.functionColumn,
    //         key: "action",
    //     },
    // ];
    const today = startOfToday();
    const [employeeAttendances, setEmployeeAttendances] =
        useState<EmployeeAttendance[]>();
    // const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const thisMonth = "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    const [selectedMonth, setSelectedMonth] = useState<string>(thisMonth);
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [sortedDept, setSortedDept] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [salaries, setSalaries] = useState<dSalary[]>();
    const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
    const getSalaries = async () => {
        try {
            const res = await axiosPrivate.get<dSalary[]>(
                `/salariesByMonthYear${selectedMonth}`
            );
            console.log("success", res.data);
            res.data.map((salary) => {
                salary.departmentName = salary.userId.departmentId.name;
                salary.employeeCode = salary.userId.code;
                salary.employeeName = salary.userId.name;
                salary.createdAt = format(
                    new Date(salary.createdAt),
                    "dd/MM/yyyy"
                );
                salary.totalSalary = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(parseFloat(salary.totalSalary));
            });
            setSalaries(res.data);
        } catch (e) {
            console.log({ e });
        }
    };
    // const getEmployees = async () => {
    //     try {
    //         const res = await axiosPrivate.get<EmployeeAttendance[]>(
    //             `/attendancesByMonth_total${selectedMonth}`,
    //             {
    //                 headers: { "Content-Type": "application/json" },
    //                 withCredentials: true,
    //             }
    //         );
    //         res.data.map((employee) => {
    //             employee._id = employee.user._id;
    //             employee.code = employee.user.code;
    //             employee.name = employee.user.name;
    //             employee.departmentId = employee.user.departmentId;
    //         });
    //         console.log(res.data);
    //         setEmployeeAttendances(res.data);
    //     } catch (e) {
    //         console.log({ e });
    //     }
    // };
    useEffect(() => {
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
    }, []);
    useEffect(() => {
        // getEmployees();
        getSalaries();
    }, [selectedMonth]);
    const rows = () => {
        let sortedEmp = salaries;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (salary) =>
                    salary.employeeName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    salary.employeeCode
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (salary) => salary?.departmentName == sortedDept
            );
        }
        return sortedEmp;
    };
    useEffect(() => {
        const getAttendanceRatio = async () => {
            try {
                const res =
                    await axiosPrivate.get<AttendancePercentageResponse>(
                        "/attendanceDepartmentsPercentByMonth" + selectedMonth
                    );
                let label: string[] = [];
                let ratio: number[] = [];
                let quantity: number[] = [];
                console.log(res.data);
                res.data.result.forEach((dept) => {
                    label.push(dept.departmentName);
                    ratio.push(dept.departmentPercent);
                    quantity.push(dept.departmentAttendances);
                });
                setAttendanceLabel(label);
                setAttendanceRatio(ratio);
                setAttendanceQuantity(quantity);
                setTotalAttendance(res.data.totalAmount);
            } catch (e) {
                console.log({ e });
            }
        };
        getAttendanceRatio();
    }, []);

    const exportToExcel = async () => {
        let workbook = XLSX.utils.book_new();

        // let worksheet = workbook.addWorksheet("Goals");
        // let worksheet = workbook.Sheets["Attendance Report"];
        const titleRow = [
            "No",
            "Employee Code",
            "Full name",
            "Department",
            "Working day",
            "Overtime",
        ];
        let worksheet = XLSX.utils.aoa_to_sheet([titleRow]);
        worksheet["A1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["B1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["C1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["D1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["E1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["F1"].s = {
            font: {
                name: "arial",
                bold: true,
                color: "#2C3D3A",
            },
            fill: {
                fgColor: { rgb: "9BBB59" },
            },
        };
        worksheet["!cols"] = [
            { wch: 3 },
            { wch: 15 },
            { wch: 10 },
            { wch: 12 },
            { wch: 12 },
            { wch: 8 },
        ];
        // fitToColumn(titleRow);
        // function fitToColumn(arrayOfArray: string[]) {
        //     // get maximum character of each column
        //     return arrayOfArray.map((a, i) => ({
        //         wch: a.length,
        //     }));
        // }
        await employeeAttendances?.forEach((item, index) => {
            XLSX.utils.sheet_add_aoa(
                worksheet,
                [
                    [
                        index + 1 + "",
                        item.code + "",
                        item.name + "",
                        item?.departmentId?.name + "" || "",
                        item.totalWorkingDays + "",
                        item.totalOvertimeHours + "",
                    ],
                ],
                { origin: -1 }
            );
        });
        console.log({ worksheet });
        try {
            // XLSX.utils.book_append_sheet(wb, ws)
            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Attendance Report"
            );
            XLSX.writeFile(workbook, "AttendanceReport.xlsx");
        } catch (err) {
            console.log({ err });
        }
    };
    const months = getMonthsBetweenDates(startDay, today);
    return (
        <div className="flex w-full items-center justify-center flex-col gap-3">
            <div className=" flex gap-x-7 items-end w-[90%]">
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
                {allowRows(
                    [
                        process.env.HRManager,
                        process.env.CEO,
                        process.env.DepartmentManager,
                        process.env.TeamManager,
                    ],
                    session?.user.roles || []
                ) && (
                    <CustomDropdown
                        placeholder="Select department"
                        additionalStyle="flex-1 h-full"
                        buttonStyle="bg-white border h-[39px]"
                        options={departments}
                        onSelect={setSortedDept}
                        value={sortedDept}
                    />
                )}
                <CustomDropdown
                    placeholder="Month"
                    options={months}
                    buttonStyle="w-[120px] bg-white"
                    value={selectedMonth}
                    onSelect={(val) => setSelectedMonth(val)}
                    // additionalStyle="w-[100px]"
                />
                <RegularButton label="Export excel" callback={exportToExcel} />
            </div>
            <div className="flex flex-1 flex-col bg-white w-[90%] items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex flex-col">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h3 className=" text-[26px] font-semibold text-[#2C3D3A]">
                            Salary payment list
                        </h3>
                        <div className="flex gap-3">
                            {/* <CustomDropdown
                                placeholder="Month"
                                additionalStyle="min-w-[100px]"
                                buttonStyle="bg-white border"
                            /> */}
                        </div>
                    </div>
                    <TableFirstForm
                        columns={columns}
                        rows={rows()}
                        // viewFunction={(id) => {
                        //     router.push("/attendance/log/" + id);
                        // }}
                    />
                </div>
            </div>
            <div className="flex flex-col w-[90%] self-center bg-white border shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)]  rounded-md py-6 my-4">
                <h2 className={`text-[26px] font-semibold text-[#2C3D3A] ml-5`}>
                    Attendance per department
                </h2>
                <div className="flex flex-1 justify-between px-5 self-center w-full">
                    <div className="flex flex-col justify-center">
                        {totalAttendance && (
                            <p>Total Attendance: {totalAttendance}</p>
                        )}
                        {attendanceQuantity &&
                            attendanceLabel?.map((item, index) => (
                                <p>
                                    {item}: {attendanceQuantity[index]}
                                </p>
                            ))}
                    </div>
                    <div className="flex w-[400px] h-[400px] items-stretch">
                        {attendanceLabel && attendanceRatio && (
                            <PieChart
                                dataset={attendanceRatio}
                                label={attendanceLabel}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryReports;
