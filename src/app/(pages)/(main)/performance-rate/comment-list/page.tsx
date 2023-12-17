"use client";
import { Input } from "@nextui-org/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import TableFirstForm, {
  ColumnEnum,
  ColumnType,
} from "src/components/tableFirstForm";
import allowRows from "src/helper/allowRoles";
import { SearchIcon } from "src/svgs";
import { CommentGet } from "src/types/commentType";

type dCommentGet = CommentGet & {
  revieweeName?: string;
  revieweeCode?: string;
  reviewerName?: string;
  commentDate: string;
  createdAt: string;
  reviewDay: string;
  month: string;
};

const CommentForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const { data: session } = useSession();
  const [selfComments, setSelfComments] = useState<dCommentGet[]>([]);
  const [empComments, setEmpComments] = useState<dCommentGet[]>([]);

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
  const row = () => {
    let filteredRow = empComments.filter(
      (emp) => format(new Date(emp.commentMonth), "/MM/yyyy") == selectedMonth
    );
    return filteredRow;
  };
  return (
    <div className=" w-full flex flex-col gap-y-3">
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
            <TableFirstForm columns={empColumns} rows={row()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
