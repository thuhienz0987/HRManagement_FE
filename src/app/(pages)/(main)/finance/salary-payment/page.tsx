"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import SalaryStackChart from "src/components/salaryStackChart";
import { SearchIcon } from "src/svgs";
import { Label } from "@radix-ui/react-select";
import axios, { AxiosError } from "axios";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useEffect, useState } from "react";
import { Salary } from "src/types/salaryTypes";
import { add, format } from "date-fns";
import { Department } from "src/types/userType";
import { useRouter } from "next13-progressbar";
import { useSession } from "next-auth/react";
import allowRows from "src/helper/allowRoles";
import getMonthsBetweenDates from "src/helper/getMonthBetweenDays";

type dSalary = Salary & {
    departmentName: string;
    employeeCode: string;
    employeeName: string;
    month: string;
};
type dDepartment = Department & {
    value: string;
};
const AdminSalary = () => {
    const { toast } = useToast();
    const { data: session } = useSession();
    const router = useRouter();
    const today = new Date();
    const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
    const lastMonth = add(today, {
        months: -1,
    });
    const [selectedMonth, setSelectedMonth] = useState<string>(
        "/" + (lastMonth.getMonth() + 1) + "/" + lastMonth.getFullYear()
    );
    const months = getMonthsBetweenDates(startDay, add(today, { months: -1 }));
    const axiosPrivate = useAxiosPrivate();
    const [salaries, setSalaries] = useState<dSalary[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [sortedDept, setSortedDept] = useState<string>();
    const HRcolumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Employee Code",
            type: ColumnEnum.textColumn,
            key: "employeeCode",
        },
        {
            title: "Full Name",
            type: ColumnEnum.textColumn,
            key: "employeeName",
        },
        {
            title: "Salary",
            type: ColumnEnum.textColumn,
            key: "totalSalary",
        },
        {
            title: "Department",
            type: ColumnEnum.textColumn,
            key: "departmentName",
        },
        {
            title: "Received Date",
            type: ColumnEnum.textColumn,
            key: "payDay",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
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
            key: "payDay",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    useEffect(() => {
        const getSalaries = async () => {
            try {
                const res = await axiosPrivate.get<dSalary[]>("/salaries");
                res.data.map((salary) => {
                    salary.departmentName = salary.userId.departmentId.name;
                    salary.employeeCode = salary.userId.code;
                    salary.employeeName = salary.userId.name;
                    salary.payDay = salary.payDay === null ? "Not yet" : format(
                        new Date(salary.payDay),
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
        const getSalariesByUserId = async (id?: string) => {
            try {
                const res = await axiosPrivate.get<dSalary[]>(
                    "/salaryByUserId/" + id
                );
                res.data.map((salary) => {
                    salary.dayMoney = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(parseFloat(salary?.dayMoney ?? "0"));
                    salary.allowanceAmount = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(parseFloat(salary?.allowanceAmount ?? "0"));
                    salary.bonusMoney = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(parseFloat(salary?.bonusMoney ?? "0"));
                    salary.createdAt = format(
                        new Date(salary.createdAt),
                        "dd/MM/yyyy"
                    );
                    salary.totalSalary = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(parseFloat(salary.totalSalary));
                    salary.month = "11/2023";
                });
                setSalaries(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        if (
            allowRows(
                [process.env.HRManager, process.env.CEO],
                session?.user.roles || []
            )
        ) {
            getDepartments();
            getSalaries();
        } else {
            getSalariesByUserId(session?.user._id);
        }
    }, []);

    const rows = () => {
        let sortedSalary = salaries;
        if (searchQuery) {
            sortedSalary = sortedSalary?.filter(
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
            sortedSalary = sortedSalary?.filter(
                (salary) => salary?.departmentName == sortedDept
            );
        }
        let filteredRow = sortedSalary?.filter(
            (sa) =>
                format(new Date(sa.idComment.commentMonth), "/MM/yyyy") == selectedMonth
        );
        return filteredRow;
    };
    // function getYearsBetweenDates() {
    const editSalary = async (id: string) => {
        router.replace("/finance/salary-payment/" + id);
    };
    const viewSalary = async (id: string) => {
        router.replace("/finance/salary-payment/" + id);
    };
    return (
        <>
            {allowRows(
                [process.env.HRManager, process.env.CEO],
                session?.user.roles || []
            ) ? (
                <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
                    <div className=" flex w-full gap-x-7 items-end">
                        <Input
                            className="rounded w-auto flex-1 bg-white dark:bg-[#3b3b3b]"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={
                                <p className="text-[#5B5F7B] dark:text-whiteOff">Employee code</p>
                            }
                            placeholder="Search"
                            labelPlacement={"outside"}
                            endContent={
                                <button className="bg-black dark:bg-transparent p-1 rounded">
                                    <SearchIcon />
                                </button>
                            }
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <CustomDropdown
                            label="Department"
                            placeholder="Select department"
                            additionalStyle="flex-1"
                            buttonStyle="bg-white dark:bg-[#3b3b3b]"
                            options={departments}
                            onSelect={setSortedDept}
                            value={sortedDept}
                        />
                    </div>
                    <div className="flex flex-1 flex-col w-full items-center rounded ">
                        <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                            <div className=" flex w-full px-10 gap-x-3 items-end justify-between">
                                <div className="text-[#5B5F7B] dark:text-button block text-3xl font-semibold">
                                    Salary
                                </div>
                                <div className="flex gap-x-3 items-end">
                                    <CustomDropdown
                                        placeholder="Month"
                                        options={months}
                                        buttonStyle="w-[120px] bg-white dark:bg-[#3b3b3b]"
                                        value={selectedMonth}
                                        onSelect={(val) =>
                                            setSelectedMonth(val)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="w-[95%] self-center flex">
                                {allowRows(
                                    [process.env.HRManager],
                                    session?.user.roles || []
                                ) ? (
                                    <TableFirstForm
                                        columns={HRcolumns}
                                        rows={rows()}
                                        editFunction={editSalary}
                                    />
                                ) : undefined}
                                {allowRows(
                                    [process.env.CEO],
                                    session?.user.roles || []
                                ) ? (
                                    <TableFirstForm
                                        columns={HRcolumns}
                                        rows={rows()}
                                        viewFunction={viewSalary}
                                    />
                                ) : undefined}
                            </div>
                        </div>
                    </div>
                    <div className="w-full self-center flex h-[400px]">
                        <SalaryStackChart />
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
                    {/* <div className=" flex w-full gap-x-7 items-end pl-20">
                        <Input
                            className="rounded w-auto flex-1 bg-white"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Employee code</p>}
                            placeholder="Search"
                            labelPlacement={"outside"}
                            endContent={
                                <button className="bg-black p-1 rounded">
                                    <SearchIcon />
                                </button>
                            }
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div> */}
                    <div className="flex flex-1 flex-col w-full items-center rounded ">
                        <div className="flex flex-1 flex-col bg-white   dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                            <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                                <div className="text-[#5B5F7B] dark:text-button block text-3xl font-semibold">
                                    Salary
                                </div>
                            </div>
                            <div className="w-[95%] self-center flex">
                                <TableFirstForm
                                    columns={columns}
                                    rows={rows()}
                                    viewFunction={viewSalary}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full self-center flex h-[400px]">
                        <SalaryStackChart />
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminSalary;
