"use client";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import CustomDropdown from "src/components/customDropdown";
import { DatePicker } from "src/components/datePicker";
import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";

import * as yup from "yup";
import { useFormik } from "formik";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { Department, Position, User } from "src/types/userType";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SingleDatePicker } from "src/components/singleDatePicker";

const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const editProfileSchema = yup.object({
    fullName: yup
        .string()
        .required("Full name cannot be blank")
        .max(50, "Full name length must be less than 50 characters"),
    department: yup.string().required("Must choose department"),
    position: yup.string().required("Must choose position"),
    DOB: yup.date().required("D.O.B cannot be blank"),
    gender: yup.string().required("Must choose gender"),
    address: yup
        .string()
        .required("Address cannot be blank")
        .max(150, "Address length must be less than 50 characters"),
    phoneNumber: yup
        .string()
        .required("Phone number cannot be blank")
        .min(9, "Invalid phone number")
        .max(11, "Invalid phone number")
        .matches(phoneRegExp, "Invalid phone number"),
    email: yup.string().required().email("Invalid email"),
    homeTown: yup.string().required("Home town cannot be blank"),
    ethnic: yup.string().required("Ethnic cannot be blank"),
    academicLevel: yup.string().required("Must choose academic level"),
    startDate: yup.date().required("Start date cannot be blank"),
    salaryGrade: yup.number().required("Salary grade cannot be blank"),
});

type UserResponse = User & {
    status: string;
};

type dDepartment = Department & {
    value: string;
};

type dPosition = Position & {
    value: string;
};

const EditUserProfile = () => {
    const errorClassName =
        "h-2 text-[#ff2626] text-[10px] font-light self-start ml-4 italic";

    const genderOption = [
        { name: "Male", value: "male" },
        { name: "Female", value: "female" },
    ];
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const _id = searchParams.get("id");
    const router = useRouter();
    const [profile, setProfile] = useState<User>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [positions, setPositions] = useState<dPosition[]>();
    const academicLevels = [
        { name: "College", value: "college" },
        { name: "University", value: "university" },
        { name: "Master", value: "master" },
        { name: "Doctorate", value: "doctorate" },
    ];
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getUserProfile = async (_id: string) => {
            try {
                const res = await axiosPrivate.get<UserResponse>(
                    "/user/" + _id
                );
                console.log(res.data);
                setProfile(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                res.data.map((dept) => (dept.value = dept._id));
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getPositions = async () => {
            try {
                const res = await axiosPrivate.get<dPosition[]>("/positions");
                res.data.map((dept) => (dept.value = dept._id));
                setPositions(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getPositions();
        if (_id == session?.user._id) setProfile(session?.user);
        else {
            _id && getUserProfile(_id);
        }
    }, []);

    useEffect(() => {
        if (profile) {
            formik.initialValues.fullName = profile.name;
            formik.initialValues.department = profile.departmentId._id;
            formik.initialValues.position = profile?.positionId._id;
            formik.initialValues.DOB = new Date(profile.birthday);
            formik.initialValues.gender = profile?.gender;
            formik.initialValues.address = profile?.address;
            formik.initialValues.phoneNumber = profile?.phoneNumber;
            formik.initialValues.email = profile?.email;
            formik.initialValues.homeTown = profile?.homeTown;
            formik.initialValues.ethnic = profile?.ethnicGroup;
            formik.initialValues.academicLevel = profile?.level;
            formik.initialValues.startDate = new Date(profile.createAt);
            formik.initialValues.salaryGrade = profile.salaryGrade.toString();
        }
    }, [profile]);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            department: "",
            position: "",
            DOB: new Date(),
            gender: "",
            address: "",
            phoneNumber: "",
            email: "",
            homeTown: "",
            ethnic: "",
            academicLevel: "",
            startDate: new Date(),
            salaryGrade: "",
        },

        // Pass the Yup schema to validate the form
        validationSchema: editProfileSchema,

        // Handle form submission
        onSubmit: async ({
            fullName,
            department,
            position,
            DOB,
            gender,
            address,
            phoneNumber,
            email,
            homeTown,
            ethnic,
            academicLevel,
            startDate,
            salaryGrade,
        }) => {},
    });

    // Destructure the formik object
    const { errors, touched, handleChange, handleSubmit }: any = formik;

    const moveToEditScreen = () => {
        router.replace("/account/edit-profile");
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <div className="flex gap-3 self-end mb-2">
                <RegularButton
                    label="save"
                    additionalStyle=""
                    callback={handleSubmit}
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
                        <h3 className="rounded col-span-2 text-[26px] font-semibold text-[#2C3D3A]">
                            Attendance log
                        </h3>

                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"name"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Full name
                                    </p>
                                }
                                placeholder="Enter your name"
                                labelPlacement={"outside"}
                                name="fullName"
                                onChange={handleChange}
                                value={formik.values.fullName}
                            />
                            {errors.fullName && touched.fullName && (
                                <span className={errorClassName}>
                                    {errors.fullName}
                                </span>
                            )}
                        </div>
                        <div>
                            <CustomDropdown
                                label="Department"
                                placeholder="Select department"
                                buttonStyle="bg-white"
                                options={departments}
                                value={formik.values.department}
                                onSelect={(value) =>
                                    formik.setFieldValue("department", value)
                                }
                            />
                            {errors.department && touched.department && (
                                <span className={errorClassName}>
                                    {errors.department}
                                </span>
                            )}
                        </div>
                        <div>
                            <CustomDropdown
                                label="Position"
                                placeholder="Select position"
                                onSelect={(value) =>
                                    formik.setFieldValue("position", value)
                                }
                                buttonStyle="bg-white"
                                options={positions}
                                value={formik.values.position}
                            />
                            {errors.position && touched.position && (
                                <span className={errorClassName}>
                                    {errors.team}
                                </span>
                            )}
                        </div>
                        <div>
                            <CustomDropdown
                                label="Team"
                                placeholder="Select team"
                                buttonStyle="bg-white"
                                options={departments}
                                value={formik.values.department}
                                onSelect={(value) =>
                                    formik.setFieldValue("department", value)
                                }
                            />
                            {errors.team && touched.team && (
                                <span className={errorClassName}>
                                    {errors.team}
                                </span>
                            )}
                        </div>
                        <Input
                            isDisabled
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"code"}
                            type="text"
                            label={
                                <p className="text-[#5B5F7B] font-medium">
                                    Employee code
                                </p>
                            }
                            labelPlacement={"outside"}
                            value={profile?.code}
                        />

                        <div>
                            <SingleDatePicker label="D.O.B" />
                        </div>

                        <div>
                            <CustomDropdown
                                label="Gender"
                                placeholder="Select gender"
                                buttonStyle="bg-white"
                                onSelect={(value) => {
                                    formik.setFieldValue("gender", value);
                                }}
                                options={genderOption}
                                value={formik.values.gender}
                                name="gender"
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                classNames={{ inputWrapper: "border" }}
                                className="col-span-2"
                                radius="sm"
                                variant="bordered"
                                key={"address"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Address
                                    </p>
                                }
                                placeholder="Enter your address"
                                labelPlacement={"outside"}
                                onChange={handleChange}
                                value={formik.values.address}
                                name="address"
                            />
                            {errors.address && touched.address && (
                                <span className={errorClassName}>
                                    {errors.address}
                                </span>
                            )}
                        </div>
                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"phone"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Phone number
                                    </p>
                                }
                                placeholder="Enter your phone number"
                                labelPlacement={"outside"}
                                onChange={handleChange}
                                value={formik.values.phoneNumber}
                                name="phoneNumber"
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <span className={errorClassName}>
                                    {errors.phoneNumber}
                                </span>
                            )}
                        </div>

                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"email"}
                                type="email"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Email
                                    </p>
                                }
                                placeholder="Enter your email"
                                labelPlacement={"outside"}
                                onChange={handleChange}
                                value={formik.values.email}
                                name="email"
                            />
                            {errors.email && touched.email && (
                                <span className={errorClassName}>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"hometown"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Home town
                                    </p>
                                }
                                placeholder="Enter your home town"
                                labelPlacement={"outside"}
                                onChange={handleChange}
                                value={formik.values.homeTown}
                                name="homeTown"
                            />
                            {errors.homeTown && touched.homeTown && (
                                <span className={errorClassName}>
                                    {errors.homeTown}
                                </span>
                            )}
                        </div>

                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"ethnic"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Ethnic
                                    </p>
                                }
                                // placeholder="Enter your ethnic"
                                labelPlacement={"outside"}
                                onChange={handleChange}
                                value={formik.values.ethnic}
                                name="ethnic"
                            />
                            {errors.ethnic && touched.ethnic && (
                                <span className={errorClassName}>
                                    {errors.ethnic}
                                </span>
                            )}
                        </div>
                        <div>
                            <CustomDropdown
                                label="Academic level"
                                placeholder="Select academic"
                                onSelect={() => null}
                                options={academicLevels}
                                value={formik.values.academicLevel}
                            />
                        </div>
                        <div>
                            <SingleDatePicker label="Start date" />
                        </div>
                        <h3 className="rounded col-span-2 text-[26px] font-semibold text-[#2C3D3A]">
                            Salary Information
                        </h3>

                        <Input
                            isDisabled
                            onChange={handleChange}
                            value={profile?.positionId.basicSalary}
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"basicSalary"}
                            type="number"
                            label={
                                <p className="text-[#5B5F7B] font-medium">
                                    Basic salary
                                </p>
                            }
                            labelPlacement={"outside"}
                            placeholder="Enter basic salary"
                            name="basicSalary"
                        />
                        <div>
                            <Input
                                className="rounded"
                                radius="sm"
                                variant="bordered"
                                key={"salaryGrade"}
                                type="text"
                                label={
                                    <p className="text-[#5B5F7B] font-medium">
                                        Salary grade
                                    </p>
                                }
                                labelPlacement={"outside"}
                                placeholder="Enter salary grade"
                                name="salaryGrade"
                                onChange={handleChange}
                                value={formik.values.salaryGrade}
                            />
                            {errors.salaryGrade && touched.salaryGrade && (
                                <span className={errorClassName}>
                                    {errors.salaryGrade}
                                </span>
                            )}
                        </div>
                        <Input
                            isDisabled
                            className="rounded"
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            label={
                                <p className="text-[#5B5F7B]">
                                    Max number of absent day
                                </p>
                            }
                            labelPlacement={"outside"}
                            value={"12"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserProfile;
