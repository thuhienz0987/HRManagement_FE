"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { format, parseISO, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { SearchIcon } from "src/svgs";
import { Department } from "src/types/userType";
import { Attendance } from "src/types/attendanceType";

type dDailyAttendances = Attendance & {
    employeeCode: string;
    fullName: string;
    departmentName: string;
    status: string;
};

type dDepartment = Department & {
    value: string;
};

const DailyAttendance = () => {
    const today = startOfToday();
    const axiosPrivate = useAxiosPrivate();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [dailyAttendances, setDailyAttendances] = useState<dDailyAttendances[]>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [sortedDept, setSortedDept] = useState<string>();

    useEffect(() => {
        const getAttendancesByDate = async (day: number, month: number, year: number) => {
            try {
                const res = await axiosPrivate.get<dDailyAttendances[]>(`/attendancesByDate/${day}/${month}/${year}`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                res.data.map((attendance) => {
                    attendance.status = "Arrive on time";
                    attendance.checkInTime = format(
                        parseISO(attendance.checkInTime),
                        "kk:mm:ss"
                    );
                    let [hours, minutes, seconds] = attendance.checkInTime.split(':').map(Number);

                    // Create a new Date object for the arrival time
                    let arriveTime = new Date();
                    arriveTime.setHours(hours);
                    arriveTime.setMinutes(minutes);
                    arriveTime.setSeconds(seconds);
                    if((arriveTime.getHours() > 7)||
                    (arriveTime.getHours() === 7 && arriveTime.getMinutes() > 0)) 
                        attendance.status = "Arrive late";

                    if(attendance.checkOutTime) 
                    {
                        attendance.checkOutTime = format(
                            parseISO(attendance.checkOutTime),
                            "kk:mm:ss"
                        );
                        let [hours, minutes, seconds] = attendance.checkOutTime.split(':').map(Number);

                        // Create a new Date object for the arrival time
                        let leaveTime = new Date();
                        leaveTime.setHours(hours);
                        leaveTime.setMinutes(minutes);
                        leaveTime.setSeconds(seconds);
                        if(attendance.status === "Arrive on time" && leaveTime.getHours() < 17) 
                            attendance.status = "Leave soon";
                        if(attendance.status === "Arrive late" && leaveTime.getHours() < 17) 
                            attendance.status = "Not complete";
                        if(attendance.status === "Arrive on time" && leaveTime.getHours() >= 17)
                            attendance.status = "Complete";
                    }
                    
                    attendance.employeeCode = attendance?.userId?.code;
                    attendance.fullName = attendance?.userId?.name;
                    attendance.departmentName = attendance?.userId?.departmentId?.name;
                });
                setDailyAttendances(res.data);
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
        getAttendancesByDate(today.getDate(), today.getMonth() + 1, today.getFullYear());
    }, []);
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
            key: "fullName",
        },
        {
            title: "Arrive time",
            type: ColumnEnum.textColumn,
            key: "checkInTime",
        },
        {
            title: "Leave time",
            type: ColumnEnum.textColumn,
            key: "checkOutTime",
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
    const rows = () => {
        let sortedEmp = dailyAttendances;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (attendance) =>
                    attendance.fullName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    attendance.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (attendance) => attendance?.departmentName == sortedDept
            );
        }
        return sortedEmp;
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded">
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className=" flex w-full px-6 gap-x-7 items-end ">
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
                <div className="w-[95%] self-center flex">
                    <TableFirstForm columns={columns} rows={rows()}/>
                </div>
            </div>
        </div>
    );
};

export default DailyAttendance;
