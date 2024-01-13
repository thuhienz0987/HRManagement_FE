"use client";
import { Input } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import ImageUploading, { ImageListType } from "react-images-uploading";

import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import { CameraIcon } from "src/svgs";
import { Department, Position, Team } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import { format } from "date-fns";
import { errorClassName } from "src/componentsClassName/errorClassName";
import { SingleDatePicker } from "src/components/singleDatePicker";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const addProfileSchema = yup.object({
  name: yup
    .string()
    .required("Full name cannot be blank")
    .max(50, "Full name length must be less than 50 characters"),
  departmentId: yup.string().required("Must choose department"),
  teamId: yup.string().required("Must choose team"),
  positionId: yup.string().required("Must choose position"),
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
  email: yup.string().required("Email cannot be blank").email("Invalid email"),
  homeTown: yup.string().required("Home town cannot be blank"),
  ethnicGroup: yup.string().required("Ethnic group cannot be blank"),
  level: yup.string().required("Must choose academic level"),
  avatarUrl: yup.string(),
});
type dDepartment = Department & {
  value: string;
};

type dPosition = Position & {
  value: string;
};

type dTeam = Team & {
  value: string;
};

const AddNewEmployee = () => {
  const router = useRouter();
  const [departments, setDepartments] = useState<dDepartment[]>();
  const [positions, setPositions] = useState<dPosition[]>();
  const [teams, setTeams] = useState<dTeam[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageListType>([]);
  const { toast } = useToast();
  const genders = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
  ];
  const levels = [
    { name: "College", value: "college" },
    { name: "University", value: "university" },
    { name: "Master", value: "master" },
    { name: "Doctorate", value: "doctorate" },
  ];
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      departmentId: "",
      positionId: "",
      DOB: new Date(),
      gender: "",
      address: "",
      phoneNumber: "",
      homeTown: "",
      ethnicGroup: "",
      level: "",
      teamId: "",
      avatarUrl: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: addProfileSchema,

    // Handle form submission
    onSubmit: async ({
      name,
      departmentId,
      positionId,
      DOB,
      gender,
      address,
      phoneNumber,
      email,
      homeTown,
      ethnicGroup,
      level,
      teamId,
    }) => {
      setIsLoading(true);
      console.log('SFSFSDD', name,
      departmentId,
      positionId,
      DOB,
      gender,
      address,
      phoneNumber,
      email,
      homeTown,
      ethnicGroup,
      level,
      teamId,)
      try {
        const formData = new FormData();
        if (images.length && images[0].file?.size)
          formData.append(
            "avatarImage",
            images[0].file,
            new Date() + "_avatarImage"
          );
        formData.append("email", email);
        formData.append("name", name);
        formData.append("phoneNumber", phoneNumber);
        formData.append("ethnicGroup", ethnicGroup);
        formData.append("homeTown", homeTown);
        formData.append("address", address);
        formData.append("birthday", format(DOB, "dd/MM/yyyy"));
        formData.append("gender", gender);
        formData.append("level", level);
        formData.append("positionId", positionId);
        if (teamId !== "a") formData.append("teamId", teamId);
        if (departmentId !== "a") formData.append("departmentId", departmentId);

        console.log({formData});
      
        const response = await axiosPrivate.post(`/create-user`, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log("success", JSON.stringify(response.data));
        toast({
          title: `${formik.values?.name}'s profile has been created and employee's password was sent to email ${formik.values?.email}`,
          description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
        });
      } catch (err) {
        console.log("err", err);
        toast({
          title: `${formik.values?.name}'s profile has not been created yet due to error `,
          description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
        });
        //   setTitle('Error');
        //   setMessage(err.response.data.error);
        //   setLoading(false);
      } finally {
        setIsLoading(false);
        //   setVisible(true);
      }
    },
  });
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const res = await axiosPrivate.get<dDepartment[]>("/departments");
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
  }, []);
  useEffect(() => {
    const getTeamsByDepartmentId = async () => {
      try {
        const res = await axiosPrivate.get<dTeam[]>(
          "/teams/" + formik.values.departmentId
        );
        res.data.map((team) => (team.value = team._id));
        setTeams(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    formik.values?.departmentId?.length && getTeamsByDepartmentId();
  }, [formik?.values.departmentId]);
  const { errors, touched, handleChange, handleSubmit }: any = formik;

  const moveToAddScreen = () => {
    router.prefetch("/employee/add-employee");
  };

  const hasTeam = () => {
    const position = positions?.find((p) => p._id === formik?.values.positionId)
    if (
      position?.code === "CEO" ||
      position?.code === "DEM"
    )
      return false;
    return true;
  };
  const hasTeamResult = hasTeam();
  const hasDept = () => {
    const position = positions?.find((p) => p._id === formik?.values.positionId)
    if (position?.code === "CEO") return false;
    return true;
  };
  const onChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    formik.setFieldValue("avatarUrl", imageList[0].dataURL);
  };
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
      <div className="flex gap-3 self-end mb-2">
        <RegularButton
          label="save"
          additionalStyle=""
          callback={handleSubmit}
          isLoading={isLoading}
        />
        <RegularButton
          label="cancel"
          additionalStyle="bg-[#BDBDBD]"
          callback={moveToAddScreen}
        />
      </div>
      {/* Basic information */}
      <div className=" w-11/12 rounded-lg flex bg-white dark:bg-dark flex-col md:flex-row">
        <div className="flex flex-col w-1/4 self-center md:self-start">
          <ImageUploading
            value={images}
            onChange={onChangeImage}
            multiple={false}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div className="flex mt-[20%] mx-7 w-3/4 items-end flex-col justify-end">
                <img
                  src={formik.values.avatarUrl != "" ? formik.values.avatarUrl : "https://res.cloudinary.com/dux8aqzzz/image/upload/v1685547037/xd0gen7b4z5wgwuqfvpz.png"}
                  alt="Employee avatar"
                  className="h-[200px] w-[200px] rounded-full object-cover"
                />

                <button
                  className=" w-12 h-12 bg-bar rounded-[14px] border-4 border-white items-center justify-center flex absolute"
                  onClick={onImageUpload}
                >
                  <CameraIcon width="22" height="18" />
                </button>
              </div>
            )}
          </ImageUploading>
        </div>

        <div className="flex flex-1">
          <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full pt-16 pb-3 px-5 gap-y-2 gap-x-7">
            <h3 className="rounded col-span-2 text-[26px] font-semibold text-[#2C3D3A] dark:text-button">
              Basic Information
            </h3>

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"name"}
                type="text"
                label={<p className="text-[#5B5F7B] font-medium ">Full name</p>}
                placeholder="Enter your name"
                labelPlacement={"outside"}
                name="name"
                onChange={handleChange}
                value={formik.values.name}
              />
              {errors.name && touched.name && (
                <span className={errorClassName}>{errors.name}</span>
              )}
            </div>
            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"email"}
                type="email"
                label={<p className="text-[#5B5F7B] font-medium">Email</p>}
                placeholder="Enter your email"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.email}
                name="email"
              />
              {errors.email && touched.email && (
                <span className={errorClassName}>{errors.email}</span>
              )}
            </div>
            {hasDept() && (
              <div>
                <CustomDropdown
                  label="Department"
                  key={"departmentId"}
                  name="departmentId"
                  placeholder="Select department"
                  buttonStyle="bg-white dark:bg-[#3b3b3b]"
                  options={departments}
                  onChange={handleChange}
                  value={formik.values.departmentId}
                  onSelect={(value) =>
                    formik.setFieldValue("departmentId", value)
                  }
                />
                {errors.departmentId && touched.departmentId && (
                  <span className={errorClassName}>{errors.departmentId}</span>
                )}
              </div>
            )}
            <div>
              <CustomDropdown
                label="Position"
                placeholder="Select position"
                key={"positionId"}
                name="positionId"
                onSelect={(value) => formik.setFieldValue("positionId", value)}
                onChange={handleChange}
                buttonStyle="bg-white  dark:bg-[#3b3b3b]"
                options={positions}
                value={formik.values.positionId}
              />
              {errors.positionId && touched.positionId && (
                <span className={errorClassName}>{errors.positionId}</span>
              )}
            </div>
            {hasTeamResult && (
              <div>
                <CustomDropdown
                  label="Team"
                  key={"teamId"}
                  name="teamId"
                  placeholder="Select team"
                  buttonStyle="bg-white  dark:bg-[#3b3b3b]"
                  options={teams}
                  onChange={handleChange}
                  value={formik.values.teamId}
                  onSelect={(value) => formik.setFieldValue("teamId", value)}
                />
                {errors.teamId && touched.teamId && (
                  <span className={errorClassName}>{errors.teamId}</span>
                )}
              </div>
            )}

            <div>
              <SingleDatePicker
                label="D.O.B"
                key={"DOB"}
                date={formik.values.DOB}
                setDate={(date) => {
                  formik.setFieldValue("DOB", date);
                }}
              />
              {errors.DOB && touched.DOB && (
                <span className={errorClassName}>{errors.DOB}</span>
              )}
            </div>

            <div>
              <CustomDropdown
                label="Gender"
                key={"gender"}
                placeholder="Select gender"
                buttonStyle="bg-white  dark:bg-[#3b3b3b]"
                onSelect={(value) => {
                  formik.setFieldValue("gender", value);
                }}
                options={genders}
                onChange={handleChange}
                value={formik.values.gender}
                name="gender"
              />
              {errors.gender && touched.gender && (
                <span className={errorClassName}>{errors.gender}</span>
              )}
            </div>
            <div>
              <CustomDropdown
                label="Academic level"
                placeholder="Select academic"
                key={"level"}
                onSelect={(value) => {
                  formik.setFieldValue("level", value);
                }}
                options={levels}
                value={formik.values.level}
                onChange={handleChange}
                buttonStyle="bg-white  dark:bg-[#3b3b3b]"
                name="level"
              />
              {errors.level && touched.level && (
                <span className={errorClassName}>{errors.level}</span>
              )}
            </div>
            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"phoneNumber"}
                type="text"
                label={
                  <p className="text-[#5B5F7B] font-medium">Phone number</p>
                }
                placeholder="Enter your phone number"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.phoneNumber}
                name="phoneNumber"
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <span className={errorClassName}>{errors.phoneNumber}</span>
              )}
            </div>

            

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"homeTown"}
                type="text"
                label={<p className="text-[#5B5F7B] font-medium">Home town</p>}
                placeholder="Enter your home town"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.homeTown}
                name="homeTown"
              />
              {errors.homeTown && touched.homeTown && (
                <span className={errorClassName}>{errors.homeTown}</span>
              )}
            </div>

            <div>
              <Input
                className="rounded"
                radius="sm"
                variant="bordered"
                key={"ethnicGroup"}
                type="text"
                label={<p className="text-[#5B5F7B] font-medium">Ethnic Group</p>}
                placeholder="Enter your ethnic"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.ethnicGroup}
                name="ethnicGroup"
              />
              {errors.ethnic && touched.ethnic && (
                <span className={errorClassName}>{errors.ethnic}</span>
              )}
            </div>
            <div className="col-span-2">
              <Input
                classNames={{ inputWrapper: "border" }}
                className="col-span-2"
                radius="sm"
                variant="bordered"
                key={"address"}
                type="text"
                label={<p className="text-[#5B5F7B] font-medium">Address</p>}
                placeholder="Enter your address"
                labelPlacement={"outside"}
                onChange={handleChange}
                value={formik.values.address}
                name="address"
              />
              {errors.address && touched.address && (
                <span className={errorClassName}>{errors.address}</span>
              )}
            </div>
            <h3 className="rounded col-span-2 text-[26px] font-semibold text-[#2C3D3A]  dark:text-button">
              Salary Information
            </h3>
            <Input
              isDisabled
              className="rounded"
              radius="sm"
              variant="bordered"
              type="text"
              label={<p className="text-[#5B5F7B] font-medium">Salary grade</p>}
              labelPlacement={"outside"}
              value={"1.0"}
            />
            <Input
              isDisabled
              className="rounded"
              radius="sm"
              variant="bordered"
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

export default AddNewEmployee;
