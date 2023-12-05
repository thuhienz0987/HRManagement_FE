"use client";
import { Input } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import CustomDropdown from "src/components/customDropdown";
import { DatePicker } from "src/components/datePicket";
import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";

const EditUserProfile = () => {
    const router = useRouter();
    const basicInformation = [
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Department", value: "Marketing" },
        { label: "Gender", value: "Male" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
        { label: "Full name", value: "Nguyen Van A" },
    ];
    const contactInformation = [
        { label: "Phone number", value: "0921346731" },
        { label: "Email", value: "nguyvana@gmail.com" },
        {
            label: "Address",
            value: "123 Điện Biên Phủ, Bình Thạnh, Hồ Chí Minh",
        },
    ];

    const moveToEditScreen = () => {
        router.replace("/account/edit-profile");
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <div className="flex gap-3 self-end mb-2">
                <RegularButton
                    label="save"
                    additionalStyle=""
                    callback={moveToEditScreen}
                />
                <RegularButton
                    label="cancel"
                    additionalStyle="bg-[#BDBDBD]"
                    callback={moveToEditScreen}
                />
            </div>

            {/* Basic information */}
            <div className=" w-11/12 rounded-lg flex bg-white flex-col md:flex-row">
                <div className="flex flex-col w-1/4 self-center md:self-start">
                    <div className="flex mt-[20%] mx-7 w-3/4 items-end flex-col justify-end">
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                            alt="Employee avatar"
                            className="h-full rounded-full "
                        />
                        <button className=" w-12 h-12 bg-bar rounded-[14px] border-4 border-white items-center justify-center flex absolute">
                            <CameraIcon width="22" height="18" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-1">
                    <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full pt-16 pb-3 px-5 gap-y-2 gap-x-7">
                        <Input
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Email</p>}
                            placeholder="Enter your email"
                            labelPlacement={"outside"}
                        />
                        <Input
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Email</p>}
                            placeholder="Enter your email"
                            labelPlacement={"outside"}
                        />
                        <CustomDropdown
                            label="Department"
                            placeholder="Select department"
                            onSelect={() => null}
                        />
                        <CustomDropdown
                            label="Position"
                            placeholder="Select position"
                            onSelect={() => null}
                        />
                        <DatePicker label="D.O.B" />
                        <CustomDropdown
                            label="Gender"
                            placeholder="Select gender"
                            onSelect={() => null}
                        />
                        <Input
                            className="rounded col-span-2"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Address</p>}
                            placeholder="Enter your address"
                            labelPlacement={"outside"}
                        />
                        {/* {basicInformation.map((info) => (
                            <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
                                <p className="w-1/2 block text-start break-words font-semibold">
                                    {info.label}:
                                </p>
                                <p className=" text-start font-normal">
                                    {info.value}
                                </p>
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserProfile;
