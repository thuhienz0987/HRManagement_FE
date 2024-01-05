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
import { format, parseISO, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import * as yup from "yup";
import { useFormik } from "formik";
import { CommentGet, CommentSend } from "src/types/commentType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { errorClassName } from "src/componentsClassName/errorClassName";
import InputText from "src/components/inputText";

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
    Amount: yup
        .string()
        .required("Full name cannot be blank")
        .max(50, "Full name length must be less than 50 characters"),
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

  const formik = useFormik({
    initialValues: {
      rate: 10,
      comment: "",
      revieweeId: "",
      type: "",
      amount: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: commentSchema,

    // Handle form submission
    onSubmit: async ({ rate, revieweeId, comment }) => {
      setIsLoading(true);
      try {
        console.log({ rate, revieweeId, comment });
        const commentMonth = "1" + selectedMonth;

        const response = await axiosPrivate.post<CommentResponse>(`/comment`, {
          rate,
          comment,
          reviewerId: session?.user._id,
          revieweeId,
          commentMonth,
        });
        console.log("success", JSON.stringify(response.data));
        const reviewedEmp = employees?.filter(
          (emp) => emp._id == revieweeId
        )[0];
        setEmployees(employees?.filter((emp) => emp._id != revieweeId));
        toast({
          title: `${reviewedEmp?.name}'s comment has been recorded `,
          description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
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
            description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
  });
    const option = [
        { name: "Attendance", value: "Attendance" },
        { name: "Salary", value: "Salary" },
        { name: "Personal Information", value: "Personal Information" },
        { name: "Others", value: "Others" },
    ];
  const today = new Date();
  const lastMonth = "/" + today.getMonth() + "/" + today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(lastMonth);
  const startDay = new Date(2023, 10, 1, 0, 0, 0, 0);
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

  const columns: ColumnType[] = [
    {
      title: "No",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Type",
      type: ColumnEnum.filterColumn,
      key: "type",
    },
    {
      title: "Amount",
      type: ColumnEnum.textColumn,
      key: "amount",
    },
    {
      title: "Description",
      type: ColumnEnum.textColumn,
      key: "description",
    },
    {
      title: "Request Date",
      type: ColumnEnum.textColumn,
      key: "requestDate",
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
    let sortedEmp = employees;
    if (searchQuery) {
      sortedEmp = sortedEmp?.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
 
  const handleSave = () => {
    handleSubmit();
  };

  const { errors, touched, handleChange, handleSubmit }: any = formik;
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
      <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
        <div className="flex gap-3 self-end mb-2">
            <RegularButton
            label="save"
            additionalStyle=""
            callback={handleSubmit}
            isLoading={isLoading}
            />
            <RegularButton
            label="cancel"
            additionalStyle="bg-[#BDBDBD]"
            />
        </div>
        <div  className="flex flex-1 bg-white dark:bg-dark w-full min-h-unit-3 items-start py-16 px-28 gap-14">
            
            
            <div className="flex w-full items-start py-5 gap-12 flex-col">
                <div  className="flex bg-white dark:bg-dark w-1/2 min-h-unit-3 items-start">
                    <CustomDropdown
                        label="Type"
                        placeholder="Choose a type"
                        onSelect={() => null}
                        options={option}
                        //value={formik.values.type}
                        buttonStyle="bg-white  dark:bg-[#3b3b3b]"
                        additionalStyle="flex-1"
                    />
                </div>
                <div className="flex bg-white dark:bg-dark w-1/2 min-h-unit-3 items-start">
                    <Input
                        className="rounded"
                        radius="sm"
                        variant="bordered"
                        key={"name"}
                        type="text"
                        label={<p className="text-[#5B5F7B] font-medium ">Amount</p>}
                        placeholder="Amount"
                        labelPlacement={"outside"}
                        name="Amount"
                        onChange={handleChange}
                        //value={formik.values.amount}
                    />
                </div>
                <div className="w-full gap-2 flex flex-col py-4">
                    <p className="text-start break-words font-semibold dark:text-whiteOff">
                    Description:
                    </p>
                    <Textarea
                    className="h-[100px], w-auto"
                    //onChange={(e) => formik.setFieldValue("comment", e.target.value)}
                    />
                    {/* {errors.comment && touched.comment && (
                    <span className={errorClassName}>{errors.comment}</span>
                    )} */}
                </div>
                </div>
                <div className="flex bg-white dark:bg-dark w-full min-h-unit-3 item-end">
                    <p>Proof file/photo</p>
                </div>
        </div>
        <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
          <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
            <div className="text-[#2C3D3A] dark:text-button block text-3xl font-semibold">
              Report requests
            </div>
            <div className=" flex gap-x-3 items-end">
              <Input
                className="rounded w-auto flex-1"
                classNames={{
                  inputWrapper: "bg-white border dark:bg-[#3b3b3b]",
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
