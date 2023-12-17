"use client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { LeaveRequest } from "src/types/leaveRequestType";

type dLeaveRequest = LeaveRequest & {
    department: string;
    name?: string | null;
    code?: string | null;
    createdAt: Date;
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
    const { toast } = useToast();
    const [leaveRequests, setLeaveRequests] = useState<dLeaveRequest[]>();
    const { data: session } = useSession();
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
                    lr.createdAt = new Date(lr.createdAt);
                });
                setLeaveRequests(res.data);
                console.log(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getLeaveRequestByUserId = async (id?: string) => {
            try {
                const res = await axiosPrivate.get<dLeaveRequest[]>(
                    "/leaveRequests/" + id
                );
                res.data.map((lr) => {
                    lr.name = lr?.userId?.name;
                    lr.code = lr?.userId?.code;
                    // lr.department = lr?.userId?.departmentId.name;
                    lr.startDate = format(new Date(lr.startDate), "dd/MM/yyyy");
                    lr.endDate = format(new Date(lr.endDate), "dd/MM/yyyy");
                    lr.createdAt = new Date(lr.createdAt);
                });
                setLeaveRequests(res.data);
                console.log('leaveRequests',res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        if(session?.user.roles.includes(process.env.HRManager))
            getLeaveRequest();
        else
            getLeaveRequestByUserId(session?.user._id);
    }, []);
    const todayLeaveRequests = leaveRequests?.filter((req) => {
        const reqDate = new Date(req.createdAt);
        return (
            reqDate.getDate() == today.getDate() &&
            reqDate.getMonth() == today.getMonth() &&
            reqDate.getFullYear() == today.getFullYear()
        );
    });
    const handleView = (id: string) => {
        router.push("/attendance/absent/" + id);
    };
    const isCurrentUser = (leaveRequestId: string) => {
        const leaveRequest = leaveRequests?.find((leaveRequest) => leaveRequest._id === leaveRequestId)
        if(leaveRequest?.userId._id === session?.user._id && leaveRequest?.status === "pending")
            return true;
        else
            return false;
    };
    const handleEdit = (id: string) => {
        const functionName = "edit";
        if(isCurrentUser(id))
            router.push("/attendance/absent/" + id + "?functionName=" + functionName);
        else
            toast({
                title: `Error Permission`,
                description: `You don't have permission to do this action`,
            })
    };
    const handleDelete = async (id: string) => {
        if(isCurrentUser(id))
            {
                try {
                    const res = await axiosPrivate.delete<dLeaveRequest>(
                        "/leaveRequest/" + id,
                        {
                            headers: { "Content-Type": "application/json" },
        
                            withCredentials: true,
                        }
                    );
                    console.log({ res });
                    const updatedLeaveRequest = leaveRequests?.filter(leaveRequest => leaveRequest._id !== id);
                    setLeaveRequests(updatedLeaveRequest);
                    const leaveRequest = leaveRequests?.find((leaveRequest) => leaveRequest._id === id);
                    toast({
                        title: `Delete leave request successfully `,
                        description: [
                            `Employee: ${leaveRequest?.userId.name}\t`,
                            `Start date: ${leaveRequest?.startDate}\t`,
                            `End date: ${leaveRequest?.endDate}\t`,
                            `Reason: ${leaveRequest?.reason}`
                            ]  
                    });
                } catch (e) {
                    console.log({ e }, { id });
                    if (axios.isAxiosError(e)) {
                        console.log(e.status);
                        toast({
                          title: `Error `,
                          description: e.response?.data?.error,
                        });
                      } else {
                        console.log(e);
                        toast({
                          title: `Error `,
                          description: "Something has went wrong, please try again",
                        });
                      }
                }
            }
        else
            toast({
                title: `Error Permission`,
                description: `You don't have permission to do this action`,
            })
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-11/12 self-center gap-9 pb-8">
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        rows={todayLeaveRequests}
                        columns={columns}
                        tableName="Today absent requests"
                        viewFunction={handleView}
                        deleteFunction={(leaveRequestId) => handleDelete(leaveRequestId)}
                        editFunction={(leaveRequestId) => handleEdit(leaveRequestId)}
                    />
                </div>
                <div className="flex bg-white w-full gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg p-7">
                    <TableFirstForm
                        columns={columns}
                        tableName="Absent requests list"
                        rows={leaveRequests}
                        viewFunction={handleView}
                        deleteFunction={(leaveRequestId) => handleDelete(leaveRequestId)}
                        editFunction={(leaveRequestId) => handleEdit(leaveRequestId)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Absent;
