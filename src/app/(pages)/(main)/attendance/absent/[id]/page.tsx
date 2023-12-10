"use client";
import RegularButton from "src/components/regularButton";
import { DatePicker } from "src/components/datePicker";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { LeaveRequest } from "src/types/leaveRequestType";
import { Button } from "../../../../../../../@/components/ui/button";
import { cn } from "../../../../../../../@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useToast } from "../../../../../../../@/components/ui/use-toast";
import { useRouter } from "next13-progressbar";

const AbsentDetail = ({
    params,
}: {
    params: {
        id: string;
    };
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const handleApprove = async () => {
        try {
            const res = await axiosPrivate.put<LeaveRequest>(
                "/approverLeaveRequest/" + params.id,
                {
                    newStatus: "approved",
                }
            );
            toast({
                title: `${leaveRequest?.userId.name}'s request has been accepted `,
            });
            // setLeaveRequest(res.data);
            router.back();
            console.log(res.data);
        } catch (e) {
            console.log({ e });
        }
    };
    const handleReject = async () => {
        try {
            const res = await axiosPrivate.put<LeaveRequest>(
                "/approverLeaveRequest/" + params.id,
                {
                    newStatus: "denied",
                }
            );
            toast({
                title: `${leaveRequest?.userId.name}'s request has been rejected `,
            });
            // setLeaveRequest(res.data);
            router.back();
            console.log(res.data);
        } catch (e) {
            console.log({ e });
        }
    };
    const today = new Date();
    const { data: session } = useSession();
    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>();
    const basicInformation = [
        { label: "Full name", value: session?.user.name },
        { label: "Department", value: session?.user.departmentId.name },
        { label: "Employee code", value: session?.user.code },
        { label: "Position", value: session?.user.positionId.name },
        { label: "Status", value: leaveRequest?.status },
    ];

    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getLeaveRequest = async (id: string) => {
            try {
                const res = await axiosPrivate.get<LeaveRequest>(
                    "/leaveRequest/" + id
                );
                res.data;
                setLeaveRequest(res.data);
                console.log(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getLeaveRequest(params.id);
    }, []);
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <div className="flex gap-3 self-end mb-2">
                {leaveRequest?.status == "pending" && (
                    <>
                        <RegularButton
                            label="Approve"
                            callback={handleApprove}
                        />
                        <RegularButton
                            label="Reject"
                            additionalStyle="bg-bar"
                            callback={handleReject}
                        />
                    </>
                )}
            </div>
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <p className=" font-semibold text-2xl self-center mb-3 text-black">
                    Application for Leave of Absence
                </p>
                <div className="flex justify-between w-full">
                    <div className="flex text-[#5B5F7B] gap-2">
                        <p className="inline text-start break-words font-semibold">
                            Dear:
                        </p>
                        <p className=" text-start font-normal inline">
                            Thu He - CEO
                        </p>
                    </div>
                    <div className="flex text-[#5B5F7B] gap-2">
                        <p className="inline text-start break-words font-semibold">
                            Date:
                        </p>
                        <p className=" text-start font-normal inline">
                            {format(today, "dd/MM/yyyy")}
                        </p>
                    </div>
                </div>
                <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full gap-y-4 gap-x-7">
                    {basicInformation.map((info) => (
                        <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
                            <p className="w-1/2 block text-start break-words font-semibold">
                                {info.label}:
                            </p>
                            <p className=" text-start font-normal">
                                {info.value}
                            </p>
                        </div>
                    ))}
                </div>
                <div>
                    <p className="text-start font-semibold inline">
                        Requested day off:
                    </p>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal border rounded-lg w-3/4"
                        )}
                        disabled
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {leaveRequest?.startDate &&
                            (leaveRequest?.endDate ? (
                                <>
                                    {format(
                                        new Date(leaveRequest.startDate),
                                        "LLL dd, y"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                        new Date(leaveRequest.endDate),
                                        "LLL dd, y"
                                    )}
                                </>
                            ) : (
                                format(
                                    new Date(leaveRequest.startDate),
                                    "LLL dd, y"
                                )
                            ))}
                    </Button>
                </div>
                <div className="w-full gap-2 flex flex-col">
                    <p className="text-start break-words font-semibold">
                        Reason:
                    </p>
                    <p>{leaveRequest?.reason}</p>
                </div>
                <div className="w-full gap-2 flex flex-col">
                    <p className="text-start break-words font-semibold">
                        Commitment:
                    </p>
                    <p></p>
                </div>
            </div>
        </div>
    );
};

export default AbsentDetail;
