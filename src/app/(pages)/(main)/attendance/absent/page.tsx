"use client";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { LeaveRequest } from "src/types/leaveRequestType";
import { User } from "src/types/userType";

type dLeaveRequest = LeaveRequest & User;

const Absent = () => {
    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Employee",
            type: ColumnEnum.textColumn,
            key: "employee",
        },
        {
            title: "FullName",
            type: ColumnEnum.textColumn,
            key: "fullName",
        },
        {
            title: "RequestDay",
            type: ColumnEnum.textColumn,
            key: "requestDay",
        },
        {
            title: "Department",
            type: ColumnEnum.textColumn,
            key: "department",
        },
        {
            title: "Status",
            type: ColumnEnum.textColumn,
            key: "status",
        },
    ];
    const [leaveRequests, setLeaveRequests] = useState<dLeaveRequest[]>();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getLeaveRequest = async () => {
            try {
                const res = await axiosPrivate.get<dLeaveRequest[]>(
                    "/leaveRequests"
                );
                res.data.map((lr) => {
                    lr.name = lr.userId.name;
                    lr.code = lr.userId.code;
                    lr.departmentId == lr.userId.departmentId;
                });
                setLeaveRequests(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getLeaveRequest();
    }, []);
    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-11/12 self-center gap-9 pb-8">
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        columns={columns}
                        tableName="Today absent requests"
                    />
                </div>
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        columns={columns}
                        tableName="Absent requests list"
                    />
                </div>
            </div>
        </div>
    );
};

export default Absent;
