"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { Textarea } from "../../../../../../@/components/ui/textarea";
import { SearchIcon } from "src/svgs";
import { Label } from "@radix-ui/react-select";

const Salary = () => {
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
            title: "Created Date",
            type: ColumnEnum.textColumn,
            key: "createdDate",
        },
        {
            title: "Description",
            type: ColumnEnum.textColumn,
            key: "description",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const handleSearch = () => {};
    const handleSubmit = () => {};
    const handleCancel = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                    <div className="flex gap-3 self-end mb-2">
                        <RegularButton label="submit" callback={handleSubmit} />
                        <RegularButton
                            label="cancel"
                            additionalStyle="bg-[#BDBDBD]"
                            callback={handleCancel}
                        />
                    </div>
                    <div className="flex w-full items-start py-10 gap-48">
                        <CustomDropdown
                            label="Type"
                            placeholder="Select type"
                            additionalStyle="flex-1"
                        />
                        <CustomDropdown
                            label="Position"
                            placeholder="Select position"
                            additionalStyle="flex-1"
                        />
                    </div>
                    <div className="w-[40%] gap-2 flex flex-col">
                        <p className="text-start break-words font-semibold">
                            Amount:
                        </p>
                        <Input
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            labelPlacement={"outside"}
                        />
                    </div>
                    <div className="w-full gap-2 flex flex-col">
                        <p className="text-start break-words font-semibold">
                            Description:
                        </p>
                        <Textarea className="h-[100px]" />
                    </div>
                </div>
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Salary Component
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
                        <TableFirstForm columns={columns}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Salary;
