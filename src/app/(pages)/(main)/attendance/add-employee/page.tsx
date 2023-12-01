"use client";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import { DatePicker } from "src/components/datePicker";
import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";
import { Department, Position } from "src/types/userType";

type dDepartment = Department & {
    value: string;
};

type dPosition = Position & {
    value: string;
};

const AddNewEmployee = () => {
    const router = useRouter();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [positions, setPositions] = useState<dPosition[]>();
    const genders = [
        { name: "Male", value: "male" },
        { name: "Female", value: "female" },
    ];
    const academicLevels = [
        { name: "College", value: "college" },
        { name: "University", value: "university" },
        { name: "Master", value: "master" },
        { name: "Doctorate", value: "doctorate" },
    ];
    // const [selectedDepartment, setSelectedDepartment] = useState<string>();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                res.data.map((dept) => (dept.value = dept.name));
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getPositions = async () => {
            try {
                const res = await axiosPrivate.get<dPosition[]>("/positions");
                res.data.map((dept) => (dept.value = dept.name));
                setPositions(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getPositions();
    }, []);

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
                <div className="flex flex-1 flex-col">
                    <h2 className="text-2xl font-semibold pt-16 pb-4">
                        Basic Information
                    </h2>
                    <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full pb-3 px-5 gap-y-2 gap-x-7">
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={<p className="text-[#5B5F7B]">Full name</p>}
                            placeholder="Enter full name"
                            labelPlacement={"outside"}
                        />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Department"
                            placeholder="Select department"
                            buttonStyle="bg-white border"
                            options={departments}
                        />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Position"
                            placeholder="Select position"
                            buttonStyle="bg-white border"
                            options={positions}
                        />
                        <DatePicker label="D.O.B" buttonStyle="border" />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Gender"
                            placeholder="Select gender"
                            buttonStyle="bg-white border"
                            options={genders}
                        />
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            className="col-span-2"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={<p className="text-[#5B5F7B]">Address</p>}
                            placeholder="Enter your address"
                            labelPlacement={"outside"}
                        />
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={
                                <p className="text-[#5B5F7B]">Phone number</p>
                            }
                            placeholder="Enter phone number"
                            labelPlacement={"outside"}
                        />
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Email</p>}
                            placeholder="Enter email"
                            labelPlacement={"outside"}
                        />
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={<p className="text-[#5B5F7B]">Ethnic</p>}
                            placeholder="Enter ethnic"
                            labelPlacement={"outside"}
                        />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Academic level"
                            placeholder="Select gender"
                            buttonStyle="bg-white border"
                            options={academicLevels}
                        />
                        {/* <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="email"
                            label={<p className="text-[#5B5F7B]">Email</p>}
                            placeholder="Enter your d"
                            labelPlacement={"outside"}
                        />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Department"
                            placeholder="Select department"
                        />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Position"
                            placeholder="Select position"
                        />
                        <DatePicker label="D.O.B" />
                        <CustomDropdown
                            onSelect={() => {}}
                            label="Gender"
                            placeholder="Select gender"
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
                        /> */}
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
                    <h2 className="text-2xl font-semibold pt-16 pb-4">
                        Salary Information
                    </h2>
                    <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full pb-3 px-5 gap-y-2 gap-x-7">
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={
                                <p className="text-[#5B5F7B]">Basic salary</p>
                            }
                            placeholder="VND"
                            labelPlacement={"outside"}
                        />
                        <Input
                            classNames={{ inputWrapper: "border" }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={
                                <p className="text-[#5B5F7B]">Salary grade</p>
                            }
                            placeholder="VND"
                            labelPlacement={"outside"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewEmployee;
