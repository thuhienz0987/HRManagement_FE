"use client";
import {
  Avatar,
  Input,
  Listbox,
  ListboxItem,
  Selection,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import BlurModal from "src/components/modal";
import RegularButton from "src/components/regularButton";
import { SearchIcon } from "src/svgs";
import { Department, User } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import { Toaster } from "../../../../../../@/components/ui/toaster";
import { Attendance } from "src/types/attendanceType";
import { format, parseISO } from "date-fns";
import axios, { AxiosError } from "axios";

type Employee = User & {
  createdAt: string;
  department?: string;
};

type dDepartment = Department & {
  value: string;
};

type CheckInResponse = {
  attendance: Attendance;
  message: string;
};

const AttendanceForm = () => {
  const [employees, setEmployees] = useState<Employee[]>();
  const [departments, setDepartments] = useState<dDepartment[]>();
  const [sortedDept, setSortedDept] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [selectedEmpId, setSelectedEmpId] = useState<string>();
  const [values, setValues] = useState<Selection>();

  const { toast } = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const axiosPrivate = useAxiosPrivate();

  console.log(selectedEmpId);

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
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await axiosPrivate.get<Employee[]>("/all-user", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setEmployees(res.data);
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
    getEmployees();
  }, []);

  const checkIn = async () => {
    try {
      const res = await axiosPrivate.post<CheckInResponse>(
        "/attendance",
        {
          userId: selectedEmpId,
        },
        {
          headers: { "Content-Type": "application/json" },

          withCredentials: true,
        }
      );
      const attendance = res.data.attendance;
      console.log({ attendance });
      const checkedInUser = employees?.find(
        (emp) => emp._id == attendance.userId._id
      );
      toast({
        title: `${checkedInUser?.name}: has checked in `,
        description: format(
          parseISO(attendance.checkInTime.toString()),
          "EEEE, MMMM dd, yyyy 'at' h:mm a"
        ),
      });
    } catch (e) {
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
  const handleSave = () => {
    if (!selectedEmpId) onOpen();
    else checkIn();
  };
  const handleCancel = () => {};
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
      <BlurModal
        title="Employee selection missing"
        body="You must select an employee to perform timekeeping"
        isOpen={isOpen}
        onClose={onClose}
      />
      <div className="flex gap-3 self-end mb-2">
        <RegularButton label="save" callback={handleSave} />
      </div>
      <div className="flex flex-1 bg-white w-full min-h-unit-3 items-start py-16 px-28 gap-14">
        <CustomDropdown
          onSelect={setSortedDept}
          options={departments}
          label="Department"
          placeholder="Select department"
          buttonStyle="bg-white border"
          additionalStyle="flex-1"
        />
        <div className="flex flex-1 flex-col">
          <Input
            className="rounded w-auto flex-1"
            classNames={{
              inputWrapper: "bg-white border",
            }}
            radius="sm"
            variant="bordered"
            key={"a"}
            type="email"
            placeholder="Search"
            labelPlacement={"outside"}
            label={<p className="text-[#5B5F7B] font-medium">Employee code</p>}
            endContent={
              <div className="bg-black p-1 rounded opacity-80">
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
              // defaultSelectedKeys={["1"]}
              items={rows()}
              label="Assigned to"
              selectionMode="single"
              onSelectionChange={(key) => {
                setValues(key);
                let selectedArray: Key[] = [];
                if (key instanceof Set) {
                  selectedArray = Array.from(key);
                }
                setSelectedEmpId(selectedArray[0]?.toString() || undefined);
              }}
              variant="flat"
            >
              {(item) => (
                <ListboxItem key={item._id} textValue={item.name}>
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={item.name}
                      className="flex-shrink-0"
                      size="sm"
                      src={item.avatarImage}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{item.name}</span>
                      <span className="text-tiny text-default-400">
                        {item.code}
                      </span>
                    </div>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
