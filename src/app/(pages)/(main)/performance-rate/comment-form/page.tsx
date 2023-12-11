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
import { Label } from "@radix-ui/react-select";
import { User, Department } from "src/types/userType";
import { Key, useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { format, parseISO, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";

const CommentForm = () => {
  type Employee = User & {
    createdAt: string;
    department?: string;
    status: string;
  };

  type dDepartment = Department & {
    value: string;
  };
  const [departments, setDepartments] = useState<dDepartment[]>();
  const {data: session} = useSession();
  const [employees, setEmployees] = useState<Employee[]>();
  const [selectedEmpId, setSelectedEmpId] = useState<string>();
  const [values, setValues] = useState<Selection>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [selectedScore, setSelectedScore] = useState<number>(10);

  const [sortedDept, setSortedDept] = useState<string>();
  const axiosPrivate = useAxiosPrivate();
  const columns: ColumnType[] = [
    {
      title: "No",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Employee code",
      type: ColumnEnum.filterColumn,
      key: "code",
    },
    {
      title: "Full name",
      type: ColumnEnum.textColumn,
      key: "name",
    },
    {
      title: "Team",
      type: ColumnEnum.textColumn,
      key: "createdDate",
    },
    {
      title: "Description",
      type: ColumnEnum.textColumn,
      key: "description",
    },
    {
      title: "Date",
      type: ColumnEnum.textColumn,
      key: "date",
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
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await axiosPrivate.get<Employee[]>("/department-member/" + session?.user.departmentId._id, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        res.data.map((employee) => {
          employee.createdAt = format(
            parseISO(employee.createdAt),
            "dd/MM/yyyy"
          );
          employee.department = employee?.departmentId?.name;
          employee.status = employee.dayOff ? "Lay Off" : "Working";
        });
        setEmployees(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getEmployees();
  }, []);
  const handleSave = () => {};
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
      <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
        <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
          <div className="flex gap-3 self-end mb-2">
            <RegularButton label="Save" callback={handleSave} />
          </div>
          <div className="flex w-full items-start py-10 gap-36">
            <div>
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
              label={
                <p className="text-[#5B5F7B] font-medium">Employee code</p>
              }
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
            
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[#5B5F7B] font-medium">Employee code</p>
              <div className="flex gap-2">
                {Array.from({ length: 10 }, (v, k) => k + 1).map((val) => (
                  <button onClick={()=>setSelectedScore(val)} className={`border w-9 h-9  rounded-md items-center flex justify-center ${selectedScore == val ? "bg-bar text-white": "bg-white hover:bg-[#f4f4f5] text-black"}`}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full gap-2 flex flex-col py-10">
            <p className="text-start break-words font-semibold ">
              Description:
            </p>
            <Textarea className="h-[100px]" />
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
          <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
            <div className="text-[#2C3D3A] block text-3xl font-semibold">
              Recent comments
            </div>
            <div className=" flex gap-x-3 items-end">
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
                endContent={
                  <button className="bg-black p-1 rounded">
                    <SearchIcon />
                  </button>
                }
              />
            </div>
          </div>
          <div className="w-[95%] self-center flex">
            <TableFirstForm columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
