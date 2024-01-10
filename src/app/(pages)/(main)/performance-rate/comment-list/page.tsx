"use client";
import { Checkbox, Input, useDisclosure } from "@nextui-org/react";
import { add, format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import BlurModal from "src/components/modal";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import axios from "axios";
import allowRows from "src/helper/allowRoles";
import { SearchIcon } from "src/svgs";
import { Allowances } from "src/types/allowancesType";
import { CommentGet } from "src/types/commentType";
import { User } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import { useRouter } from "next13-progressbar";
import getMonthsBetweenDates from "src/helper/getMonthBetweenDays";

type dCommentGet = CommentGet & {
    revieweeName?: string;
    revieweeCode?: string;
    reviewerName?: string;
    commentDate: string;
    createdAt: string;
    reviewDay: string;
    month: string;
};
type dAllowances = Allowances & {
    value: string;
};

const CommentForm = () => {
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();
    const { data: session } = useSession();
    const { toast } = useToast();
    const [selfComments, setSelfComments] = useState<dCommentGet[]>([]);
    const [empComments, setEmpComments] = useState<dCommentGet[]>([]);
    const [allowances, setAllowances] = useState<dAllowances[]>();
    const [idAllowance, setIdAllowance] = useState<string[]>();
    const [selectedEmp, setSelectedEmp] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date();
    const lastMonth = add(today, {
        months: -1,
    });
    const [selectedMonth, setSelectedMonth] = useState<string>(
        "/" + (lastMonth.getMonth() + 1) + "/" + lastMonth.getFullYear()
    );
    const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const months = getMonthsBetweenDates(startDay, add(today, { months: -1 }));
    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Score",
            type: ColumnEnum.textColumn,
            key: "rate",
        },
        {
            title: "Comment",
            type: ColumnEnum.textColumn,
            key: "comment",
        },
        {
            title: "Month",
            type: ColumnEnum.textColumn,
            key: "month",
        },
        {
            title: "Comment Date",
            type: ColumnEnum.textColumn,
            key: "reviewDay",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const empColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Reviewer name",
            type: ColumnEnum.textColumn,
            key: "reviewerName",
        },
        {
            title: "Reviewee name",
            type: ColumnEnum.textColumn,
            key: "revieweeName",
        },
        {
            title: "Score",
            type: ColumnEnum.textColumn,
            key: "rate",
        },
        {
            title: "Comment",
            type: ColumnEnum.textColumn,
            key: "comment",
        },
        {
            title: "Month",
            type: ColumnEnum.textColumn,
            key: "month",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];

    useEffect(() => {
        const getSelfComments = async () => {
            try {
                const res = await axiosPrivate.get<dCommentGet[]>(
                    "/comments-by-revieweeId/" + session?.user._id
                );
                console.log(res.data);
                res.data.map((emp) => {
                    const reviewDay = new Date(emp.createdAt);
                    const reviewOfMonth = new Date(emp.commentMonth);
                    emp.reviewDay = format(reviewDay, "dd/MM/yyyy");
                    emp.month = format(reviewOfMonth, "MMM, yyyy");
                });
                setSelfComments(res.data);
            } catch (e) {
                console.log(e);
            }
        };
        getSelfComments();
    }, []);
    useEffect(() => {
        const getAllowances = async () => {
            try {
                const res = await axiosPrivate.get<dAllowances[]>(
                    "/allowances"
                );
                res.data.map((a) => (a.value = a._id));
                setAllowances(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getAllowances();
    }, []);

    useEffect(() => {
        const getEmployeeComments = async () => {
            try {
                const res = await axiosPrivate.get<dCommentGet[]>("/comments");
                console.log(res.data);
                res.data.map((emp) => {
                    emp.revieweeName = emp.revieweeId.name;
                    emp.reviewerName = emp.reviewerId.name;
                    const reviewDay = new Date(emp.createdAt);
                    const reviewOfMonth = new Date(emp.commentMonth);
                    emp.reviewDay = format(reviewDay, "dd/MM/yyyy");
                    emp.month = format(reviewOfMonth, "MMM, yyyy");
                });
                setEmpComments(res.data);
            } catch (e) {
                console.log(e);
            }
        };
        getEmployeeComments();
    }, []);
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        allowanceId: string
    ) => {
        if (event.target.checked) {
            // Add the selected allowance to the idAllowance array
            setIdAllowance((prevIdAllowance: string[] | undefined) => [
                ...(prevIdAllowance || []),
                allowanceId,
            ]);
        } else {
            // Remove the allowance from the idAllowance array if unchecked
            setIdAllowance((prevIdAllowance: string[] | undefined) =>
                prevIdAllowance
                    ? prevIdAllowance.filter((id) => id !== allowanceId)
                    : []
            );
        }
    };
    const salaryFunction = (id: string) => {
        const employee = empComments.find(
            (comment) => comment._id === id
        )?.revieweeId;
        setSelectedEmp(employee);
        console.log({ selectedEmp });
        onOpen();
    };
    const calculateSalary = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.post(
                `/salary`,
                {
                    idAllowance: idAllowance,
                    userId: selectedEmp?._id,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("success", JSON.stringify(response.data));
            onClose();
            router.push("/finance/salary-payment");
            toast({
                title: `${selectedEmp?.name}'s salary has been calculated `,
                description: format(
                    new Date(),
                    "EEEE, MMMM dd, yyyy 'at' h:mm a"
                ),
            });
        } catch (err) {
            console.log("err", err);
            onClose();
            if (axios.isAxiosError(err))
                toast({
                    title: `${selectedEmp?.name}'s salary has not been calculated yet due to error `,
                    description: format(
                        new Date(),
                        "EEEE, MMMM dd, yyyy 'at' h:mm a"
                    ),
                });
            //   setTitle('Error');
            //   setMessage(err.response.data.error);
            //   setLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    const row = () => {
        let filteredRow = empComments.filter(
            (emp) =>
                format(new Date(emp.commentMonth), "/MM/yyyy") == selectedMonth
        );
        return filteredRow;
    };
    return (
        <div className=" w-full flex flex-col gap-y-3">
            <BlurModal
                hideCloseButton
                title={
                    <div className="w-full flex justify-between">
                        <p>Calculate Salary</p>
                        <div className="flex gap-2">
                            <RegularButton
                                label="Calculate Salary"
                                callback={calculateSalary}
                                isLoading={isLoading}
                            />
                            <RegularButton
                                additionalStyle="bg-bar"
                                label="Close"
                                callback={onClose}
                            />
                        </div>
                    </div>
                }
                size="4xl"
                body={
                    <div className="flex gap-10 flex-col mt-7 ml-7 mb-7">
                        <p className="inline text-start break-words font-semibold">
                            List of allowances:
                        </p>
                        <div className="flex flex-row">
                            {allowances?.map((allowance) => (
                                <div
                                    className="w-full gap-2 flex flex-row items-center"
                                    key={allowance._id}
                                >
                                    <Checkbox
                                        color="warning"
                                        onChange={(event) =>
                                            handleCheckboxChange(
                                                event,
                                                allowance._id
                                            )
                                        }
                                    />
                                    <p className="text-start break-words font-semibold">
                                        {`${
                                            allowance.name
                                        }: ${new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            parseFloat(allowance.amount)
                                        )}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                isOpen={isOpen}
                onClose={onClose}
                footerButton={false}
            />
            <div className="flex flex-1 flex-col bg-white min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg w-[90%] self-center">
                <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                    <div className="text-[#2C3D3A] block text-3xl font-semibold">
                        Personal's comments
                    </div>
                </div>
                <div className="w-[95%] self-center flex">
                    <TableFirstForm columns={columns} rows={selfComments} />
                </div>
            </div>
            {allowRows(
                [process.env.CEO, process.env.HRManager],
                session?.user.roles || []
            ) && (
                <div className="flex flex-1 flex-col bg-white min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg w-[90%] self-center">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Employee's comments
                        </div>
                        <div className=" flex gap-x-3 items-end">
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
                        <TableFirstForm
                            columns={empColumns}
                            rows={row()}
                            salaryFunction={
                                allowRows(
                                    [process.env.HRManager, process.env.CEO],
                                    session?.user.roles || []
                                )
                                    ? salaryFunction
                                    : undefined
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentForm;
