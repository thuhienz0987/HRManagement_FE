"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";

const ArriveLateOrLeaveEarly = () => {
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
    const handleSearch = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className=" flex w-full gap-x-7 items-end ">
                <p className="text-[#2C3D3A] text-4xl font-bold">
                    Today records
                </p>
                <Input
                    className="rounded w-auto flex-1"
                    classNames={{
                        inputWrapper: "bg-white border",
                    }}
                    radius="sm"
                    variant="bordered"
                    key={"a"}
                    type="email"
                    label={<p className="text-[#5B5F7B]">Employee code</p>}
                    placeholder="Search"
                    labelPlacement={"outside"}
                    endContent={
                        <button className="bg-black p-1 rounded">
                            <SearchIcon />
                        </button>
                    }
                />
                <CustomDropdown
                    label="Department"
                    placeholder="Select department"
                    additionalStyle="flex-1"
                />
                <RegularButton label="search" callback={handleSearch} />
            </div>
            <div className="flex flex-1 flex-col bg-white w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex">
                    <TableFirstForm columns={columns} tableName="Arrive late" />
                </div>
            </div>
            <div className="flex flex-1 flex-col bg-white w-full items-start py-4 gap-5 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                <div className="w-[95%] self-center flex">
                    <TableFirstForm columns={columns} tableName="Leave early" />
                </div>
            </div>
        </div>
    );
};

export default ArriveLateOrLeaveEarly;
