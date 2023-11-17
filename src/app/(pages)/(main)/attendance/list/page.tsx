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
} from "../../../../../../@/components/ui/select";
import { format, startOfToday } from "date-fns";
import { useState } from "react";
import StackChart from "src/components/stackChart";

const AttendanceList = () => {
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
    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    console.log(currentMonth);
    const handleSearch = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col bg-white w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex flex-col">
                    <div className="w-full flex flex-row gap-3 items-center">
                        <h3 className="text-[26px] font-semibold text-[#2C3D3A]">
                            Employee list
                        </h3>
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
                        <CustomDropdown
                            placeholder="Select department"
                            additionalStyle="flex-1 h-full"
                            buttonStyle="bg-white border h-[39px]"
                        />
                        <div className="flex gap-3">
                            <RegularButton
                                label="search"
                                callback={handleSearch}
                                additionalStyle="min-w-[100px]"
                            />
                            <RegularButton
                                label="add new"
                                callback={handleSearch}
                                additionalStyle="min-w-[100px] bg-black"
                            />
                        </div>
                    </div>
                    <TableFirstForm columns={columns} />
                </div>
            </div>
        </div>
    );
};

export default AttendanceList;
