"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import StackChart from "src/components/stackChart";
import { SearchIcon } from "src/svgs";
import { Label } from "@radix-ui/react-select";

const DepartmentDetails = () => {
    const teamColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Team Code",
            type: ColumnEnum.textColumn,
            key: "employeeCode",
        },
        {
            title: "Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Leader",
            type: ColumnEnum.textColumn,
            key: "leader",
        },
        {
            title: "Created Date",
            type: ColumnEnum.textColumn,
            key: "createdDate",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const employeeColumns: ColumnType[] = [
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
            title: "Team",
            type: ColumnEnum.filterColumn,
            key: "team",
        },
        {
            title: "Department",
            type: ColumnEnum.filterColumn,
            key: "department",
        },
        {
            title: "Started Date",
            type: ColumnEnum.textColumn,
            key: "startedDate",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const handleSearch = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Team Management
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
                            <RegularButton label="search" callback={handleSearch} />
                        </div>
                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={teamColumns}/>
                    </div>
                </div>
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Employee Management
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
                            <CustomDropdown
                                label=""
                                placeholder="Select department"
                                additionalStyle="flex-1"
                            />
                            <RegularButton label="search" callback={handleSearch} />
                        </div>
                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={employeeColumns}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetails;
