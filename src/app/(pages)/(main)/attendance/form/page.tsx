"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import { SearchIcon } from "src/svgs";

const AttendanceForm = () => {
    const handleSave = () => {};
    const handleCancel = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <div className="flex gap-3 self-end mb-2">
                <RegularButton label="save" callback={handleSave} />
                <RegularButton
                    label="cancel"
                    additionalStyle="bg-[#BDBDBD]"
                    callback={handleCancel}
                />
            </div>
            <div className="flex flex-1 bg-white w-full min-h-unit-3 items-start py-16 px-28 gap-14">
                <CustomDropdown
                    label="Department"
                    placeholder="Select department"
                    additionalStyle="flex-1"
                />
                <Input
                    className="rounded w-auto flex-1"
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
            </div>
        </div>
    );
};

export default AttendanceForm;
