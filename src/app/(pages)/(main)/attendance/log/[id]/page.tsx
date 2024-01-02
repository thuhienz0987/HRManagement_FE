"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
  ColumnEnum,
  ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../@/components/ui/select";
import { format, parseISO, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import StackChart from "src/components/stackChart";
import { Department, User } from "src/types/userType";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useRouter } from "next13-progressbar";
import { Attendance } from "src/types/attendanceType";
import { useToast } from "../../../../../../../@/components/ui/use-toast";
import BarChart from "src/components/barChart";

type EditModalProps = {
  row: dAttendance;
  onClose: () => void;
  onSave: (updatedRow: dAttendance) => void;
};

type dAttendance = Attendance & {
  arriveTime: string;
  leaveTime: string;
  status: string;
};

const Log = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const columns: ColumnType[] = [
    {
      title: "Date",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Arrive",
      type: ColumnEnum.textColumn,
      key: "arriveTime",
    },
    {
      title: "Leave",
      type: ColumnEnum.textColumn,
      key: "leaveTime",
    },
    {
      title: "Overtime",
      type: ColumnEnum.textColumn,
      key: "overTime",
    },
    {
      title: "Status",
      type: ColumnEnum.textColumn,
      key: "overTime",
    },
    {
      title: "Action",
      type: ColumnEnum.functionColumn,
      key: "action",
    },
  ];
  const today = startOfToday();
  const [attendances, setAttendances] = useState<dAttendance[]>();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [sortedDept, setSortedDept] = useState<string>();
  const [editableRow, setEditableRow] = useState<dAttendance | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  useEffect(() => {
    const getEmployees = async (month: number, year: number) => {
      try {
        const res = await axiosPrivate.get<dAttendance[]>(
          `/attendanceByMonth/${month}/${year}/` + params.id,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        res.data.map((atd) => {
          const checkIn = new Date(atd.checkInTime);
          atd.arriveTime = format(parseISO(atd.checkInTime), "kk:mm:ss");
          let [hours, minutes, seconds] = atd.arriveTime.split(":").map(Number);

          // Create a new Date object for the arrival time
          let arriveTime = new Date();
          arriveTime.setHours(hours);
          arriveTime.setMinutes(minutes);
          arriveTime.setSeconds(seconds);
          // if((arriveTime.getHours() > 7)||
          // (arriveTime.getHours() === 7 && arriveTime.getMinutes() > 0))
          //     attendance.status = "Arrive late";

          if (atd.checkOutTime) {
            atd.leaveTime = format(parseISO(atd.checkOutTime), "kk:mm:ss");
            let [hours, minutes, seconds] = atd.leaveTime
              .split(":")
              .map(Number);

            // Create a new Date object for the arrival time
            let leaveTime = new Date();
            leaveTime.setHours(hours);
            leaveTime.setMinutes(minutes);
            leaveTime.setSeconds(seconds);
          }
        });
        console.log(res.data);
        setAttendances(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getEmployees(currentMonth, today.getFullYear());
  }, []);
  const rows = () => {
    let sortedAtd = attendances?.sort(compareDay);
    return sortedAtd;
  };
  function compareDay(a: Attendance, b: Attendance) {
    const aDay = new Date(a.attendanceDate);
    const bDay = new Date(b.attendanceDate);
    if (aDay < bDay) {
      return -1;
    } else if (aDay > bDay) {
      return 1;
    }
    return 0;
  }
  const handleEdit = (id: string) => {
    console.log(id);
    const rowForEdit =
      attendances?.find((attendance) => attendance._id === id) || null;
    setEditableRow(rowForEdit);
    console.log(rowForEdit);
  };
  const EditModal: React.FC<EditModalProps> = ({ row, onClose, onSave }) => {
    const [formState, setFormState] = useState(row);

    return (
      <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
        <div className="flex w-full items-start py-10 gap-48">
          {/* {/* <Input 
                        value={formState.employeeCode}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        disabled={true}
                        label={<p className="text-[#5B5F7B]">Employee code</p>}
                        labelPlacement={"outside"}
                    /> */}
          <Input
            value={format(new Date(formState.attendanceDate), "dd/MM/yyyy")}
            className="rounded w-1/2 flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="text"
            disabled
            label={<p className="text-[#5B5F7B]">Date</p>}
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
              setFormState({
                ...formState,
                arriveTime: e.target.value,
              })
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
              setFormState({
                ...formState,
                leaveTime: e.target.value,
              })
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
  const onSave = async (updatedRow: dAttendance) => {
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

      const res = await axiosPrivate.put<dAttendance>(
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
      const updatedAttendances = attendances?.map((attendance) =>
        attendance._id === updatedRow._id ? updatedRow : attendance
      );
      setAttendances(updatedAttendances);
      setEditableRow(null);
      toast({
        title: `Updated arrive time and leave time of ${format(
          parseISO(updatedRow.checkInTime.toString()),
          "dd/MMM/yyyy"
        )} `,
        description: [
          "Arrive time: ",
          format(parseISO(updatedRow.checkInTime.toString()), "hh:mm a"),
          ", Leave time: ",
          format(parseISO(updatedRow.checkOutTime.toString()), "hh:mm a"),
        ],
      });
    } catch (e) {
      console.log({ e });
    }
  };
  const handleSearch = () => {};
  return (
    <div className="flex flex-1 flex-col px-[4%] pb-4 rounded gap-y-9">
      <div className=" flex w-full gap-x-7 items-end ">
        {editableRow && (
          <EditModal
            row={editableRow}
            onClose={() => setEditableRow(null)}
            onSave={(updatedRow: dAttendance) => {
              onSave(updatedRow);
            }}
          />
        )}
        {/* <CustomDropdown
                    placeholder="Select department"
                    additionalStyle="flex-1 h-full"
                    buttonStyle="bg-white border h-[39px]"
                    options={departments}
                    onSelect={setSortedDept}
                    value={sortedDept}
                /> */}
      </div>
      <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
        <div className="w-[95%] self-center flex flex-col">
          <div className="w-full flex flex-row justify-between items-center">
            <h3 className=" text-[26px] font-semibold text-[#2C3D3A] dark:text-button">
              Attendance log
            </h3>
            <div className="flex gap-3">
              {/* <CustomDropdown
                                placeholder="Month"
                                additionalStyle="min-w-[100px]"
                                buttonStyle="bg-white border"
                            /> */}
            </div>
          </div>
          <TableFirstForm
            columns={columns}
            rows={rows()}
            editFunction={handleEdit}
          />
        </div>
      </div>
      <BarChart userId={params.id} />
    </div>
  );
};

export default Log;
