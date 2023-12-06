"use client";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import CustomDropdown from "src/components/customDropdown";
import { DatePicker } from "src/components/datePicker";
import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";

import * as yup from "yup";
import { useFormik } from "formik";

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
    .min(10, "Invalid phone number")
    .max(11, "Invalid phone number")
    .matches(phoneRegExp, "Invalid phone number"),
  email: yup.string().required().email("Invalid email"),
  homeTown: yup.string().required("Home town cannot be blank"),
  ethnic: yup.string().required("Ethnic cannot be blank"),
  academicLevel: yup.string().required("Must choose academic level"),
  startDate: yup.date().required("Start date cannot be blank"),
  salaryGrade: yup.number().required("Salary grade cannot be blank"),
});

const EditUserProfile = () => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      department: "",
      position: "",
      DOB: Date.now(),
      gender: "",
      address: "",
      phoneNumber: "",
      email: "",
      homeTown: "",
      ethnic: "",
      academicLevel: "",
      startDate: Date.now(),
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
                key={"a"}
                type="text"
                label={<p className="text-[#5B5F7B]">Full name</p>}
                placeholder="Enter your name"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.fullName}
              />
              {errors.fullName && touched.fullName && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.fullName}
                </span>
              )}
            </div>
            <div>
              <CustomDropdown
                label="Department"
                placeholder="Select department"
                onSelect={() => null}
              />
            </div>
            <div>
              <CustomDropdown label="Position" placeholder="Select position" onSelect={() => null}/>
            </div>
            <Input
              disabled={true}
              className="rounded"
              radius="sm"
              variant="bordered"
              key={"a"}
              type="text"
              label={<p className="text-[#5B5F7B]">Employee code</p>}
              labelPlacement={"outside"}
            />

            <div>
              <DatePicker label="D.O.B" />
            </div>

            <div>
              <CustomDropdown label="Gender" placeholder="Select gender" onSelect={() => null}/>
            </div>
            <div>
              <Input
                className="rounded col-span-2"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="email"
                label={<p className="text-[#5B5F7B]">Address</p>}
                placeholder="Enter your address"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.address}
              />
              {errors.address && touched.address && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.address}
                </span>
              )}
            </div>
            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="text"
                label={<p className="text-[#5B5F7B]">Phone number</p>}
                placeholder="Enter your phone number"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.phoneNumber}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="email"
                label={<p className="text-[#5B5F7B]">Email</p>}
                placeholder="Enter your email"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.email}
              />
              {errors.email && touched.email && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="text"
                label={<p className="text-[#5B5F7B]">Home town</p>}
                placeholder="Enter your home town"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.homeTown}
              />
              {errors.homeTown && touched.homeTown && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.homeTown}
                </span>
              )}
            </div>

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="text"
                label={<p className="text-[#5B5F7B]">Ethnic</p>}
                placeholder="Enter your ethnic"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.ethnic}
              />
              {errors.ethnic && touched.ethnic && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.ethnic}
                </span>
              )}
            </div>
            <div>
              <CustomDropdown
                label="Academic level"
                placeholder="Select academic"
                onSelect={() => null}
              />
            </div>
            <div>
              <DatePicker label="Start date" />
            </div>
            <h3 className="rounded col-span-2 text-[26px] font-semibold text-[#2C3D3A]">
              Salary Information
            </h3>

            <Input
              disabled={true}
              className="rounded"
              radius="sm"
              variant="bordered"
              key={"a"}
              type="number"
              label={<p className="text-[#5B5F7B]">Basic salary</p>}
              labelPlacement={"outside"}
            />
            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"a"}
                type="text"
                label={<p className="text-[#5B5F7B]">Salary grade</p>}
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.salaryGrade}
              />
              {errors.salaryGrade && touched.salaryGrade && (
                <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
                  {errors.salaryGrade}
                </span>
              )}
            </div>
            <Input
              disabled={true}
              className="rounded"
              radius="sm"
              variant="bordered"
              key={"a"}
              type="text"
              label={<p className="text-[#5B5F7B]">Max number of absent day</p>}
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
