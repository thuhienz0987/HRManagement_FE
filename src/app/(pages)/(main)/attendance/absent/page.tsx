"use client";
import { format } from "date-fns";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { LeaveRequest } from "src/types/leaveRequestType";
import { User } from "src/types/userType";

type dLeaveRequest = LeaveRequest & {
    department: string;
    name?: string | null;
    code?: string | null;
};

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
            key: "code",
        },
        {
            title: "FullName",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Start Day",
            type: ColumnEnum.textColumn,
            key: "startDate",
        },
        {
            title: "End Day",
            type: ColumnEnum.textColumn,
            key: "endDate",
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
    const today = new Date();
    const [leaveRequests, setLeaveRequests] = useState<dLeaveRequest[]>();
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();
    useEffect(() => {
        const getLeaveRequest = async () => {
            try {
                const res = await axiosPrivate.get<dLeaveRequest[]>(
                    "/leaveRequests"
                );
                res.data.map((lr) => {
                    lr.name = lr?.userId?.name;
                    lr.code = lr?.userId?.code;
                    // lr.department = lr?.userId?.departmentId.name;
                    lr.startDate = format(new Date(lr.startDate), "dd/MM/yyyy");
                    lr.endDate = format(new Date(lr.endDate), "dd/MM/yyyy");
                });
                setLeaveRequests(res.data);
                console.log(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getLeaveRequest();
    }, []);
    const todayLeaveRequest = leaveRequests?.filter((req) => {
        const reqDate = new Date(req.startDate);
        return (
            reqDate.getDate() == today.getDate() &&
            reqDate.getMonth() == today.getMonth() &&
            reqDate.getFullYear() == today.getFullYear()
        );
    });
    const handleView = (id: string) => {
        router.push("/attendance/absent/" + id);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-11/12 self-center gap-9 pb-8">
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        rows={todayLeaveRequest}
                        columns={columns}
                        tableName="Today absent requests"
                    />
                </div>
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        columns={columns}
                        tableName="Absent requests list"
                        rows={leaveRequests}
                        viewFunction={handleView}
                    />
                </div>
            </div>
        </div>
    );
};

export default Absent;
