"use client";
import { useEffect, useState } from "react";
import RegularButton from "src/components/regularButton";
import { Textarea } from "../../../../../../@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Checkbox, useDisclosure } from "@nextui-org/react";
import axios, { AxiosError } from "axios";

import * as yup from "yup";
import { useFormik } from "formik";
import { FormikDatePicker } from "src/components/formikDatePicker";
import BlurModal from "src/components/modal";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { User } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import { LeaveRequest } from "src/types/leaveRequestType";
import { errorClassName } from "src/componentsClassName/errorClassName";
import { useRouter } from "next13-progressbar";

const absentFormSchema = yup.object({
  reason: yup
    .string()
    .required("Reason cannot be blank")
    .max(500, "Reason length must be less than 500 characters"),
  agreeCommitment: yup.boolean()
    .oneOf([true],"Please read and accept the Absent Policy"),
  date: yup.object().shape({
    from: yup
      .date()
      .required("you must choose date")
      .min(new Date(), "Selected date must be today or in the future"),
    to: yup
      .date()
      .min(new Date(), "Selected date must be today or in the future"),
  }),
});
const AbsentForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [HRManager, setHRManager] = useState<User>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const today = new Date();
  const { data: session } = useSession();

  const basicInformation = [
    { label: "Full name:", value: session?.user.name },
    { label: "Position:", value: session?.user.positionId.name },
    { label: "Employee code:", value: session?.user.code },
    !session?.user.roles.includes(process.env.CEO)?{ label: "Department:", value: session?.user.departmentId?.name }:undefined,
  ];
  useEffect(() => {
    const getHRManager = async () => {
        try {
            const res = await axiosPrivate.get<User>(
                "/hr-manager"
            );
            setHRManager(res.data);
        } catch (e) {
            console.log({ e });
        }
    };

    getHRManager();
}, []);

  const formik = useFormik({
    initialValues: {
      reason: "",
      agreeCommitment: false,
      date: {
        from: new Date(),
        to: new Date(),
      },
    },
    validationSchema: absentFormSchema,

    onSubmit: async ({ reason, date }) => {
      const startDate = new Date(date.from);
      const endDate = new Date(date.to);
        setIsLoading(true);
        try {
          console.log({startDate},{endDate})
          const response = await axiosPrivate.post<LeaveRequest>(
              `/leaveRequest`,
              {
                reason: reason,
                startDate: startDate,
                endDate: endDate,
                userId: session?.user._id
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
          );
          console.log("success", JSON.stringify(response.data));
          router.push('/attendance/absent');
          toast({
              title: `Absent form was submitted`,
              description: [
                `reason: ${reason}\n`,
                `startDate: ${startDate}\n`,
                `endDate: ${endDate}`,
              ],
          });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log("err", err.response?.data);
          toast({
            title: `Submit error`,
            description: [
              `Error message: ${err.response?.data.error}\t`
            ],
          });
        } else {
          console.log("err", err);
          toast({
            title: `Submit error`,
            description: `An error occurred while submitting.`,
          });
        }
      } finally {
        setIsLoading(false);
      }
      }
    },
  // }
  );

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
      <BlurModal
        hideCloseButton
        title={"MultiSolutions Company 2023"}
        tittleStyle="text-4xl font-semibold self-center"
        size="5xl"
        body={
            <>
              <p className="text-2xl font-semibold text-center mb-10">Absent Policy</p>
              <div className="text-m text-[black]] dark:text-[#black] font-medium flex-col">
                <p className="mb-3">1. <span className="text-yellow-600">Report all absences promptly:</span> Notify your supervisor or designated contact as soon as possible, preferably before the start of your scheduled work time.</p>
                <p className="mb-3">2. <span className="text-yellow-600">Provide clear explanation:</span> Briefly explain the reason for your absence, differentiating between excused and unexcused.</p>
                <p className="mb-3">3. <span className="text-yellow-600">Follow documentation procedures:</span> Submit any required documentation, such as doctor's notes or family emergency verification, within the specified timeframe.</p>
                <p className="mb-3">4. <span className="text-yellow-600">Seek approval for extended absences:</span> Request advance permission for planned absences beyond a specific duration.</p>
                <p className="mb-3">5. <span className="text-yellow-600">Respect notice periods:</span> Adhere to any established notice requirements for foreseeable absences.</p>
                <p className="mb-3">6. <span className="text-yellow-600">Minimize disruption:</span> Inform colleagues and team members of your absence and arrange for coverage, if possible.</p>
                <p className="mb-3">7. <span className="text-yellow-600">Maintain availability:</span> Be reachable during business hours for urgent matters unless extenuating circumstances prevent it.</p>
                <p className="mb-3">8. <span className="text-yellow-600">Utilize available resources:</span> Utilize sick leave, vacation time, or other paid leave options for authorized absences.</p>
                <p className="mb-3">9. <span className="text-yellow-600">Comply with disciplinary actions:</span> Accept and follow any disciplinary measures taken for exceeding absence limits or violating policy guidelines.</p>
                <p className="mb-3">10. <span className="text-yellow-600">Address underlying issues:</span> If chronic absenteeism persists, explore possible solutions with your supervisor or seek support services if available.</p>
              </div>
            </>
        }
        isOpen={isOpen}
        onClose={onClose}
        footerButton={false}
    />
      <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
        <p className=" font-semibold text-2xl self-center mb-3 text-black">
          Application for Leave of Absence
        </p>
        <div className="flex justify-between w-full">
          <div className="flex text-[#5B5F7B] gap-2">
            <p className="inline text-start break-words font-semibold">Dear:</p>
            <p className=" text-start font-normal inline">{`${HRManager?.name} - HRManager`}</p>
          </div>
          <div className="flex text-[#5B5F7B] gap-2">
            <p className="inline text-start break-words font-semibold">Date:</p>
            <p className=" text-start font-normal inline">
              {format(today, "dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full gap-y-4 gap-x-7">
          {basicInformation.map((info) => (
            <div className="w-full h-fit flex flex-wrap text-[#5B5F7B]">
              <p className="w-1/2 block text-start break-words font-semibold">
                {info?.label}
              </p>
              <p className=" text-start font-normal">{info?.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-start font-semibold inline">Requested day off:</p>
          <FormikDatePicker
            // label="Requested day off:"
            buttonStyle="border-1 rounded-sm"
            selected={formik.values.date}
            onChange={(date) => {
              formik.setFieldValue("date", date);
              formik.setFieldTouched("date", true);
              // Mark the field as touched
            }}
          />
          {!formik.values.date?.from && (
            <span className={errorClassName}>
              You must choose a date range
            </span>
          )}
          {errors.date?.from && touched.date && (
            <span className={errorClassName}>
              {errors.date.from}
            </span>
          )}
          {errors.date?.to && touched.date && (
            <span className={errorClassName}>
              {errors.date.to}
            </span>
          )}
        </div>
        <div className="w-full gap-2 flex flex-col">
          <p className="text-start break-words font-semibold">Reason:</p>
          <Textarea
            className="h-[100px]"
            name="reason"
            value={formik.values.reason}
            onChange={handleChange}
          />
          {errors.reason && touched.reason && (
            <span className={errorClassName}>
              {errors.reason}
            </span>
          )}
        </div>
        <div className="w-full gap-2 flex flex-row items-center">
          <Checkbox  color="warning" defaultSelected={formik.values.agreeCommitment}
          onChange={() => {
            formik.setFieldValue("agreeCommitment", !formik.values.agreeCommitment);
            // formik.setFieldError("agreeCommitment", undefined); // Reset the error for agreeCommitment
          }}/>
          <p className="text-start break-words font-semibold">I have read and agree the </p>
          <button
              onClick={onOpen}
              className="transform transition-all ring-5 ring-yellow-300 hover:ring-2 ring-opacity-30 duration-200 rounded-full text-yellow-600 text-start break-words font-semibold underline"
          >
              Absent Policy
          </button>
        </div>
        {errors.agreeCommitment && touched.agreeCommitment && (
          <span className={errorClassName}>
              {errors.agreeCommitment}
          </span>
        )}
        <div className="flex gap-3 self-end mt-2">
          <RegularButton label="Submit" callback={handleSubmit} isLoading={isLoading}/>
        </div>
      </div>
    </div>
  );
};

export default AbsentForm;
