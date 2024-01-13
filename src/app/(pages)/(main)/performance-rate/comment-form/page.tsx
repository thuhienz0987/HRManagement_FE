"use client";
import {
    Avatar,
    Input,
    Listbox,
    ListboxItem,
    Selection,
} from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { Textarea } from "../../../../../../@/components/ui/textarea";
import { SearchIcon } from "src/svgs";
import { User, Department } from "src/types/userType";
import { Key, useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { add, format, parseISO, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import * as yup from "yup";
import { useFormik } from "formik";
import { CommentGet, CommentSend } from "src/types/commentType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { errorClassName } from "src/componentsClassName/errorClassName";
import getMonthsBetweenDates from "src/helper/getMonthBetweenDays";

type CommentResponse = {
    message: string;
    comment: CommentSend & { _id: string };
};

type dCommentGet = CommentGet & {
    revieweeName: string;
    revieweeCode: string;
    commentDate: string;
    createdAt: string;
    reviewDay: string;
};

const commentSchema = yup.object({
    rate: yup.number().required("Please choose a rate point"),
    comment: yup
        .string()
        .required(
            "Please write some comment for your employees to help them improve"
        ),
    revieweeId: yup.string().required("Please choose employee to be reviewed"),
});

const CommentForm = () => {
    type Employee = User & {
        createdAt: string;
        department?: string;
        status: string;
    };

    type dDepartment = Department & {
        value: string;
    };
    const { data: session } = useSession();
    const [employees, setEmployees] = useState<Employee[]>();
    const [selectedEmpId, setSelectedEmpId] = useState<string>();
    const [values, setValues] = useState<Selection>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [selectedScore, setSelectedScore] = useState<number>(10);

    const [comments, setComments] = useState<dCommentGet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sortedDept, setSortedDept] = useState<string>();
    const axiosPrivate = useAxiosPrivate();
    const { toast } = useToast();

    const today = new Date();
    const lastMonth = add(today, {
        months: -1,
    });
    const [selectedMonth, setSelectedMonth] = useState<string>(
        "/" + (lastMonth.getMonth() + 1) + "/" + lastMonth.getFullYear()
    );
    const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
    const months = getMonthsBetweenDates(startDay, add(today, { months: -1 }));

    const formik = useFormik({
        initialValues: {
            rate: 10,
            comment: "",
            revieweeId: "",
        },

        // Pass the Yup schema to validate the form
        validationSchema: commentSchema,

        // Handle form submission
        onSubmit: async ({ rate, revieweeId, comment }) => {
            setIsLoading(true);
            try {
                console.log({ rate, revieweeId, comment });
                const commentMonth = "1" + selectedMonth;

                const response = await axiosPrivate.post<CommentResponse>(
                    `/comment`,
                    {
                        rate,
                        comment,
                        reviewerId: session?.user._id,
                        revieweeId,
                        commentMonth,
                    }
                );
                console.log("success", JSON.stringify(response.data));
                const reviewedEmp = employees?.filter(
                    (emp) => emp._id == revieweeId
                )[0];
                setEmployees(employees?.filter((emp) => emp._id != revieweeId));
                toast({
                    title: `${reviewedEmp?.name}'s comment has been recorded `,
                    description: format(
                        new Date(),
                        "EEEE, MMMM dd, yyyy 'at' h:mm a"
                    ),
                });
                reviewedEmp &&
                    session?.user &&
                    setComments([
                        ...comments,
                        {
                            _id: response.data.comment._id,
                            revieweeId: reviewedEmp,
                            reviewerId: session?.user,
                            rate: response.data.comment.rate,
                            comment: response.data.comment.comment,
                            commentDate: format(today, "dd/MM/yyyy"),
                            revieweeName: reviewedEmp.name,
                            revieweeCode: reviewedEmp.code,
                            reviewDay: format(today, "dd/MM/yyyy"),
                            createdAt: format(today, "dd/MM/yyyy"),
                            commentMonth: format(today, "dd/MM/yyyy"),
                        },
                    ]);
            } catch (err: AxiosError | any) {
                console.log("err", err);
                if (axios.isAxiosError(err)) {
                    toast({
                        title: err.response?.data.error,
                        description: format(
                            new Date(),
                            "EEEE, MMMM dd, yyyy 'at' h:mm a"
                        ),
                    });
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    //   return months;
    // }
    // const months = getMonthsBetweenDates();

    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Employee code",
            type: ColumnEnum.filterColumn,
            key: "revieweeCode",
        },
        {
            title: "Full name",
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
    const rows = () => {
        let sortedEmp = employees;
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
    useEffect(() => {
        const getEmployees = async () => {
            let url = "";
            if (session?.user.roles.includes(process.env.TeamManager))
                url = "/employees-without-comments/" + session?.user.teamId._id;
            if (session?.user.roles.includes(process.env.DepartmentManager))
                url =
                    "/leaders-without-comments/" +
                    session?.user.departmentId._id;
            if (session?.user.roles.includes(process.env.CEO))
                url = "/managers-without-comments";
            try {
                const res = await axiosPrivate.get<Employee[]>(
                    url + selectedMonth,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                res.data = res.data.filter((emp) => {
                    return emp._id != session?.user._id;
                });
                
                setEmployees(res.data);
                console.log({employees})
            } catch (e) {
                console.log(e);
            }
        };
        getEmployees();
        console.log({employees})
    }, [selectedMonth]);

    useEffect(() => {
        const getCommentByMonth = async () => {
            try {
                const res = await axiosPrivate.get<dCommentGet[]>(
                    "/comments-by-reviewerId/" +
                        session?.user._id +
                        selectedMonth
                );
                console.log(res.data);
                res.data.map((emp) => {
                    emp.revieweeName = emp.revieweeId.name;
                    emp.revieweeCode = emp.revieweeId.code;
                    const reviewDay = new Date(emp.createdAt);
                    emp.reviewDay = format(reviewDay, "dd/MM/yyyy");
                });
                setComments(res.data);
            } catch (e) {
                console.log(e);
                setComments([]);
            }
        };
        getCommentByMonth();
    }, [selectedMonth]);
    const handleSave = () => {
        handleSubmit();
    };

    const getHeader = () => {
        if (session?.user.roles.includes(process.env.TeamManager))
            return session.user.teamId.name;
        if (session?.user.roles.includes(process.env.DepartmentManager))
            return "Team leader of " + session.user.departmentId.name;
        if (session?.user.roles.includes(process.env.CEO))
            return "Department manager";
    };

    const { errors, touched, handleChange, handleSubmit }: any = formik;
    const tableName = months.filter((item) => item.value == selectedMonth)[0]
        ?.name;
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
                <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="text-bar dark:text-button block text-3xl font-semibold">
                            {getHeader()}
                        </h1>
                        <div className="flex gap-3 self-end mb-2">
                            <CustomDropdown
                                placeholder="Month"
                                options={months}
                                buttonStyle="w-[120px] bg-white dark:bg-[#3b3b3b]"
                                value={selectedMonth}
                                onSelect={(val) => setSelectedMonth(val)}
                                // additionalStyle="w-[100px]"
                            />
                            <RegularButton label="Save" callback={handleSave} />
                        </div>
                    </div>

                    <div className="flex w-full items-start py-5 gap-12">
                        <div>
                            <Input
                                className="rounded w-auto flex-1"
                                classNames={{
                                    inputWrapper:
                                        "bg-white border dark:bg-[#3b3b3b]",
                                }}
                                radius="sm"
                                variant="bordered"
                                key={"a"}
                                type="text"
                                placeholder="Search"
                                labelPlacement={"outside"}
                                label={
                                    <p className="text-[#5B5F7B] font-medium dark:text-whiteOff">
                                        Employee code
                                    </p>
                                }
                                endContent={
                                    <div className="bg-black p-1 rounded opacity-80 dark:bg-[#3b3b3b]">
                                        <SearchIcon />
                                    </div>
                                }
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {rows() && (
                                <Listbox
                                    // topContent={topContent}
                                    classNames={{
                                        base: "max-w-full",
                                        list: "max-h-[300px] w-full overflow-y-scroll",
                                    }}
                                    items={rows()}
                                    emptyContent="All employees under your management has been reviewed"
                                    label="Assigned to"
                                    selectionMode="single"
                                    onSelectionChange={(key) => {
                                        setValues(key);
                                        let selectedArray: Key[] = [];
                                        if (key instanceof Set) {
                                            selectedArray = Array.from(key);
                                        }
                                        setSelectedEmpId(
                                            selectedArray[0]?.toString() ||
                                                undefined
                                        );
                                        formik.setFieldValue(
                                            "revieweeId",
                                            selectedArray[0]?.toString() ||
                                                undefined
                                        );
                                    }}
                                    variant="flat"
                                >
                                    {(item) => (
                                        <ListboxItem
                                            key={item._id}
                                            textValue={item.name}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Avatar
                                                    alt={item.name}
                                                    className="flex-shrink-0"
                                                    size="sm"
                                                    src={item.avatarImage}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-small">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-tiny text-default-400">
                                                        {item.code}
                                                    </span>
                                                </div>
                                            </div>
                                        </ListboxItem>
                                    )}
                                </Listbox>
                            )}
                            {errors.revieweeId && touched.revieweeId && (
                                <span className={errorClassName}>
                                    {errors.revieweeId}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                            <p className="text-[#5B5F7B] font-medium dark:text-whiteOff">
                                Score
                            </p>
                            <div className="flex gap-2">
                                {Array.from(
                                    { length: 10 },
                                    (v, k) => k + 1
                                ).map((val) => (
                                    <button
                                        onClick={() => {
                                            setSelectedScore(val);
                                            formik.setFieldValue("rate", val);
                                        }}
                                        className={`border w-9 h-9  rounded-md items-center flex justify-center ${
                                            selectedScore == val
                                                ? "bg-bar text-white"
                                                : "bg-white hover:bg-[#f4f4f5] text-black"
                                        }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                            {errors.rate && touched.rate && (
                                <span className={errorClassName}>
                                    {errors.rate}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="w-full gap-2 flex flex-col py-4">
                        <p className="text-start break-words font-semibold dark:text-whiteOff">
                            Description:
                        </p>
                        <Textarea
                            className="h-[100px]"
                            onChange={(e) =>
                                formik.setFieldValue("comment", e.target.value)
                            }
                        />
                        {errors.comment && touched.comment && (
                            <span className={errorClassName}>
                                {errors.comment}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] dark:text-button block text-3xl font-semibold">
                            {tableName} 's comments
                        </div>
                        <div className=" flex gap-x-3 items-end">
                            <Input
                                className="rounded w-auto flex-1"
                                classNames={{
                                    inputWrapper:
                                        "bg-white border dark:bg-[#3b3b3b]",
                                }}
                                radius="sm"
                                variant="bordered"
                                key={"a"}
                                type="email"
                                placeholder="Search"
                                labelPlacement={"outside"}
                                endContent={
                                    <button className="bg-black p-1 rounded dark:bg-[#3b3b3b]">
                                        <SearchIcon />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={comments} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentForm;
