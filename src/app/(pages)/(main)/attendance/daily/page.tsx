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
import axios, { AxiosError } from "axios";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { SearchIcon } from "src/svgs";
import { Department } from "src/types/userType";
import { Attendance } from "src/types/attendanceType";
import { useToast } from "../../../../../../@/components/ui/use-toast";

type dDailyAttendances = Attendance & {
  employeeCode: string;
  fullName: string;
  departmentName: string;
  status: string;
  arriveTime: string;
  leaveTime: string;
};
type dDepartment = Department & {
  value: string;
};

type EditModalProps = {
  row: dDailyAttendances;
  onClose: () => void;
  onSave: (updatedRow: dDailyAttendances) => void;
};

const DailyAttendance = () => {
  const today = startOfToday();
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<dDepartment[]>();
  const [dailyAttendances, setDailyAttendances] =
    useState<dDailyAttendances[]>();
  const [editableRow, setEditableRow] = useState<dDailyAttendances | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>();
  const [sortedDept, setSortedDept] = useState<string>();

  useEffect(() => {
    const getAttendancesByDate = async (
      day: number,
      month: number,
      year: number
    ) => {
      try {
        const res = await axiosPrivate.get<dDailyAttendances[]>(
          `/attendancesByDate/${day}/${month}/${year}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        res.data.map((attendance) => {
          attendance.status = "Present";
          attendance.arriveTime = format(
            parseISO(attendance.checkInTime),
            "kk:mm:ss"
          );
          let [hours, minutes, seconds] = attendance.arriveTime
            .split(":")
            .map(Number);

          // Create a new Date object for the arrival time
          let arriveTime = new Date();
          arriveTime.setHours(hours);
          arriveTime.setMinutes(minutes);
          arriveTime.setSeconds(seconds);
          if (
            arriveTime.getHours() > 7 ||
            (arriveTime.getHours() === 7 && arriveTime.getMinutes() > 0)
          )
            attendance.status = "Arrive late";

          if (attendance.checkOutTime) {
            attendance.leaveTime = format(
              parseISO(attendance.checkOutTime),
              "kk:mm:ss"
            );
            let [hours, minutes, seconds] = attendance.leaveTime
              .split(":")
              .map(Number);

            // Create a new Date object for the arrival time
            let leaveTime = new Date();
            leaveTime.setHours(hours);
            leaveTime.setMinutes(minutes);
            leaveTime.setSeconds(seconds);
            if (attendance.status === "Present" && leaveTime.getHours() < 17)
              attendance.status = "Leave soon";
            if (
              attendance.status === "Arrive late" &&
              leaveTime.getHours() < 17
            )
              attendance.status = "Not complete";
            if (attendance.status === "Present" && leaveTime.getHours() >= 17)
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
        const res = await axiosPrivate.get<dDepartment[]>("/departments");
        res.data.map((dept) => (dept.value = dept.name));
        setDepartments(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getDepartments();
    getAttendancesByDate(
      today.getDate(),
      today.getMonth() + 1,
      today.getFullYear()
    );
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
      key: "arriveTime",
    },
    {
      title: "Leave time",
      type: ColumnEnum.textColumn,
      key: "leaveTime",
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
          attendance.employeeCode
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    if (sortedDept) {
      sortedEmp = sortedEmp?.filter(
        (attendance) => attendance?.departmentName == sortedDept
      );
    }
    return sortedEmp;
  };
  const onSave = async (updatedRow: dDailyAttendances) => {
    try {
      const [arriveTimeHours, arriveTimeMinutes, arriveTimeSeconds] =
        updatedRow.arriveTime.split(":");
      const attendanceDate = new Date(updatedRow.checkInTime);
      attendanceDate.setUTCHours(parseInt(arriveTimeHours, 10) - 7);
      attendanceDate.setUTCMinutes(parseInt(arriveTimeMinutes, 10));
      attendanceDate.setUTCSeconds(parseInt(arriveTimeSeconds, 10));

      updatedRow.checkInTime = attendanceDate.toISOString();

      const [leaveTimeHours, leaveTimeMinutes, leaveTimeSeconds] =
        updatedRow.leaveTime.split(":");
      attendanceDate.setUTCHours(parseInt(leaveTimeHours, 10) - 7);
      attendanceDate.setUTCMinutes(parseInt(leaveTimeMinutes, 10));
      attendanceDate.setUTCSeconds(parseInt(leaveTimeSeconds, 10));

      updatedRow.checkOutTime = attendanceDate.toISOString();

      const res = await axiosPrivate.put<dDailyAttendances>(
        "/attendance/" + updatedRow._id,
        {
          checkInTime: updatedRow.checkInTime,
          checkOutTime: updatedRow.checkOutTime,
          attendanceDate: editableRow?.attendanceDate,
        },
        {
          headers: { "Content-Type": "application/json" },

          withCredentials: true,
        }
      );
      console.log({ res });
      let arriveTime = new Date();
      arriveTime.setHours(parseInt(arriveTimeHours, 10));
      arriveTime.setMinutes(parseInt(arriveTimeMinutes, 10));
      arriveTime.setSeconds(parseInt(arriveTimeSeconds, 10));
      if (
        arriveTime.getHours() > 7 ||
        (arriveTime.getHours() === 7 && arriveTime.getMinutes() > 0)
      )
        updatedRow.status = "Arrive late";

      let leaveTime = new Date();
      leaveTime.setHours(parseInt(leaveTimeHours, 10));
      leaveTime.setMinutes(parseInt(leaveTimeMinutes, 10));
      leaveTime.setSeconds(parseInt(leaveTimeSeconds, 10));
      if (
        (arriveTime.getHours() <= 7 ||
          (arriveTime.getHours() === 7 &&
            arriveTime.getMinutes() === 0 &&
            arriveTime.getSeconds() === 0)) &&
        leaveTime.getHours() < 17
      )
        updatedRow.status = "Leave soon";
      if (
        (arriveTime.getHours() > 7 ||
          (arriveTime.getHours() === 7 &&
            (arriveTime.getMinutes() > 0 || arriveTime.getSeconds() > 0))) &&
        leaveTime.getHours() < 17
      )
        updatedRow.status = "Not complete";
      if (
        (arriveTime.getHours() <= 7 ||
          (arriveTime.getHours() === 7 &&
            arriveTime.getMinutes() === 0 &&
            arriveTime.getSeconds() === 0)) &&
        leaveTime.getHours() >= 17
      )
        updatedRow.status = "Complete";
      const updatedAttendances = dailyAttendances?.map((attendance) =>
        attendance._id === updatedRow._id ? updatedRow : attendance
      );
      setDailyAttendances(updatedAttendances);
      setEditableRow(null);
      toast({
        title: `Updated arrive time and leave time of ${updatedRow?.fullName} `,
        description: [
          "Arrive time: ",
          format(
            parseISO(updatedRow.checkInTime.toString()),
            "EEEE, MMMM dd, yyyy 'at' h:mm a"
          ),
          ", Leave time: ",
          format(
            parseISO(updatedRow.checkOutTime.toString()),
            "EEEE, MMMM dd, yyyy 'at' h:mm a"
          ),
        ],
      });
    } catch (e) {
      console.log({ e });
    }
  };
  const handleEdit = (id: string) => {
    const rowForEdit =
      dailyAttendances?.find((attendance) => attendance._id === id) || null;
    setEditableRow(rowForEdit);
  };
  const EditModal: React.FC<EditModalProps> = ({ row, onClose, onSave }) => {
    const [formState, setFormState] = useState(row);

    return (
      <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
        <div className="flex w-full items-start py-10 gap-48">
          <Input
            value={formState.employeeCode}
            className="rounded w-auto flex-1 "
            radius="sm"
            variant="bordered"
            key={"a"}
            type="text"
            disabled={true}
            label={<p className="text-[#5B5F7B]">Employee code</p>}
            labelPlacement={"outside"}
          />
          <Input
            value={formState.fullName}
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="text"
            disabled={true}
            label={<p className="text-[#5B5F7B]">Full name</p>}
            labelPlacement={"outside"}
          />
        </div>
        <div className="flex w-full items-start py-10 gap-48">
          <Input
            value={formState.arriveTime}
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="time"
            step="1"
            label={<p className="text-[#5B5F7B]">Arrive time</p>}
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, arriveTime: e.target.value })
            }
          />
          <Input
            value={formState.leaveTime}
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            step="1"
            type="time"
            label={<p className="text-[#5B5F7B]">Leave time</p>}
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, leaveTime: e.target.value })
            }
          />
        </div>

        <div className="flex gap-3 self-end mb-2">
          <RegularButton label="Save" callback={() => onSave(formState)} />
          <RegularButton
            label="Close"
            additionalStyle="bg-[#BDBDBD]"
            callback={onClose}
          />
        </div>
      </div>
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosPrivate.delete<dDailyAttendances>(
        "/attendance/" + id,
        {
          headers: { "Content-Type": "application/json" },

          withCredentials: true,
        }
      );
      console.log({ res });
      const updatedDailyAttendances = dailyAttendances?.filter(
        (dailyAttendance) => dailyAttendance._id !== id
      );
      setDailyAttendances(updatedDailyAttendances);
      const dailyAttendance = dailyAttendances?.find(
        (dailyAttendance) => dailyAttendance._id === id
      );
      toast({
        title: `Delete daily attendance successfully `,
        description: [
          `Employee: ${dailyAttendance?.userId.name}\n`,
          `Attendance date: ${dailyAttendance?.attendanceDate}\n`,
        ],
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
  };
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded">
      {editableRow && (
        <EditModal
          row={editableRow}
          onClose={() => setEditableRow(null)}
          onSave={(updatedRow: dDailyAttendances) => {
            onSave(updatedRow);
          }}
        />
      )}
      <div className="flex flex-1 flex-col bg-white  dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
        <div className=" flex w-full px-6 gap-x-7 items-end ">
          <Input
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="email"
            label={
              <p className="text-[#5B5F7B] dark:text-whiteOff">Employee code</p>
            }
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
          <TableFirstForm
            columns={columns}
            rows={rows()}
            editFunction={handleEdit}
            deleteFunction={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyAttendance;
