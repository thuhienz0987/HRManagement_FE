"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import StackChart from "src/components/stackChart";
import { SearchIcon } from "src/svgs";
import { Label } from "@radix-ui/react-select";
import axios, { AxiosError } from "axios";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useEffect, useState } from "react";
import { Salary } from "src/types/salaryTypes";
import { format } from "date-fns";
import { Department } from "src/types/userType";
import { useRouter } from "next13-progressbar";

type dSalary = Salary & {
    departmentName: string;
    employeeCode: string;
    employeeName: string;
};
type dDepartment = Department & {
    value: string;
};
const AdminSalary = () => {
    const { toast } = useToast();
    const router = useRouter();
    const today = new Date();
    const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
    const lastMonth = "/" + today.getMonth() + "/" + today.getFullYear();
    const [selectedMonth, setSelectedMonth] = useState<string>(lastMonth);
    const axiosPrivate = useAxiosPrivate();
    const [salaries, setSalaries] = useState<dSalary[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [sortedDept, setSortedDept] = useState<string>();
    const columns: ColumnType[] = [
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
            key: "createdAt",
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
                const res = await axiosPrivate.get<dSalary[]>(
                    "/salaries"
                );
                res.data.map((salary) => {
                    salary.departmentName = salary.userId.departmentId.name;
                    salary.employeeCode = salary.userId.code;
                    salary.employeeName = salary.userId.name;
                    salary.createdAt = format(new Date(salary.createdAt), "dd/MM/yyyy");
                    salary.totalSalary = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(salary.totalSalary));
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
        getDepartments();
        getSalaries();
    }, []);
    const rows = () => {
        let sortedEmp = salaries;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (salary) =>
                    salary.employeeName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    salary.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (salary) => salary?.departmentName == sortedDept
            );
        }
        return sortedEmp;
    };
    function getMonthsBetweenDates() {
        let months = [];
        let date: Date = startDay;
        while (startDay <= today) {
            if (date.getMonth() < today.getMonth()) {
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                months.push({
                    name: format(date, "MMM yyyy"),
                    value: "/" + month + "/" + year,
                });
            }

            date.setMonth(date.getMonth() + 1);
        }

        return months;
    }
    const months = getMonthsBetweenDates();
    const editSalary = async (id: string) => {
        // try {
        //     const res = await axiosPrivate.put<dSalary>(
        //         "/salary/" + id,
        //         {
        //             headers: { "Content-Type": "application/json" },

        //             withCredentials: true,
        //         }
        //     );
        //     console.log({ res });
        //     const updatedSalaries = salaries?.filter(salary => salary._id !== id);
        //     setSalaries(updatedSalaries);
        //     const salary = salaries?.find((salary) => salary._id === id);
        //     toast({
        //         title: `Delete salary successful `,
        //         description: [
        //             `Employee Code: ${salary?.employeeCode}\t`,
        //             `Employee Name: ${salary?.employeeName}\t`,
        //             `Total salary: ${salary?.totalSalary}\t`,
        //             `Department: ${salary?.departmentName}`
        //         ]
        //     });
        // } catch (e) {
        //     console.log({ e }, { id });
        //     if (axios.isAxiosError(e)) {
        //         console.log(e.status);
        //         toast({
        //           title: `Error `,
        //           description: e.response?.data?.error,
        //         });
        //       } else {
        //         console.log(e);
        //         toast({
        //           title: `Error `,
        //           description: "Something has went wrong, please try again",
        //         });
        //       }
        // }
        router.replace("/finance/salary-payment/" + id);
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className=" flex w-full gap-x-7 items-end pl-20">
                <Input
                    className="rounded w-auto flex-1"
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
                <CustomDropdown
                    label="Department"
                    placeholder="Select department"
                    additionalStyle="flex-1"
                    options={departments}
                    onSelect={setSortedDept}
                    value={sortedDept}
                />
            </div>
            <div className="flex flex-1 flex-col w-full items-center rounded ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#5B5F7B] block text-3xl font-semibold">
                            Salary
                        </div>
                        <div className="flex gap-x-3 items-end">
                            <CustomDropdown
                                placeholder="Month"
                                options={months}
                                buttonStyle="w-[120px] bg-white"
                                value={selectedMonth}
                                onSelect={(val) => setSelectedMonth(val)}
                            />
                        </div>
                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={rows()}
                        editFunction={editSalary}/>
                    </div>
                </div>
            </div>
            <div className="w-full self-center flex">
                <StackChart />
            </div>
        </div>
    );
};

export default AdminSalary;
