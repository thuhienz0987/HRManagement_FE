"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import { SearchIcon } from "src/svgs";
import { Textarea } from "../../../../../@/components/ui/textarea";
import { Button } from "react-day-picker";
import { DatePicker } from "src/components/datePicket";

const AbsentForm = () => {
    const handleSave = () => {};
    const handleCancel = () => {};
    const basicInformation = [
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Department", value: "Marketing" },
        { label: "Employee code", value: "NV001" },
        { label: "Position", value: "Manager" },
    ];
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
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <p className=" font-semibold text-2xl self-center mb-3 text-black">
                    Application for Leave of Absence
                </p>
                <div className="flex justify-between w-full">
                    <div className="flex text-[#5B5F7B] gap-2">
                        <p className="inline text-start break-words font-semibold">
                            Dear:
                        </p>
                        <p className=" text-start font-normal inline">
                            Thu He - CEO
                        </p>
                    </div>
                    <div className="flex text-[#5B5F7B] gap-2">
                        <p className="inline text-start break-words font-semibold">
                            Date:
                        </p>
                        <p className=" text-start font-normal inline">
                            03/11/2023
                        </p>
                    </div>
                </div>
                <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full gap-y-4 gap-x-7">
                    {basicInformation.map((info) => (
                        <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
                            <p className="w-1/2 block text-start break-words font-semibold">
                                {info.label}:
                            </p>
                            <p className=" text-start font-normal">
                                {info.value}
                            </p>
                        </div>
                    ))}
                </div>
                <div>
                    <p className="text-start font-semibold inline">
                        Requested day off:
                    </p>
                    <DatePicker buttonStyle="border-1 rounded-sm" />
                </div>
                <div className="w-full gap-2 flex flex-col">
                    <p className="text-start break-words font-semibold">
                        Reason:
                    </p>
                    <Textarea className="h-[100px]" />
                </div>
                <div className="w-full gap-2 flex flex-col">
                    <p className="text-start break-words font-semibold">
                        Commitment:
                    </p>
                    <Textarea className="h-[100px]" />
                </div>
            </div>
        </div>
    );
};

export default AbsentForm;
