"use client";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import { SearchIcon } from "src/svgs";
import { Textarea } from "../../../../../../@/components/ui/textarea";
import { Button } from "react-day-picker";
import { DatePicker } from "src/components/datePicker";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import * as yup from "yup";
import { useFormik } from "formik";
import { FormikDatePicker } from "src/components/formikDatePicker";

const absentFormSchema = yup.object({
  reason: yup
    .string()
    .required("Reason cannot be blank")
    .max(500, "Reason length must be less than 500 characters"),
  commitment: yup
    .string()
    .required("Commitment cannot be blank")
    .max(500, "Commitment length must be less than 500 characters"),
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
type TypeAbsent = {
  reason: string;
  commitment: string;
  date: DateRange;
};
const AbsentForm = () => {
  const handleSave = () => {};
  const handleCancel = () => {};
  const today = new Date();
  const { data: session } = useSession();

  const basicInformation = [
    { label: "Full name", value: session?.user.name },
    { label: "Department", value: session?.user.departmentId.name },
    { label: "Employee code", value: session?.user.code },
    { label: "Position", value: session?.user.positionId.name },
  ];

  const [absent, setAbsent] = useState<TypeAbsent>({
    reason: "",
    commitment: "",
    date: {
      from: new Date(),
      to: new Date(),
    },
  });

  const formik = useFormik({
    initialValues: {
      reason: "",
      commitment: "",
      date: {
        from: new Date(),
        to: new Date(),
      },
    },
    validationSchema: absentFormSchema,

    onSubmit: async ({ reason, commitment, date }) => {
      const selectedDate = new Date(date.from);

      if (selectedDate < today) {
        // Handle the case where the selected date is in the past
        formik.setFieldError(
          "date",
          "Selected date must be today or in the future"
        );
      } else {
        // Logic for submitting the form
        handleSave();
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
      <div className="flex gap-3 self-end mb-2">
        <RegularButton label="save" callback={handleSubmit} />
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
            <p className="inline text-start break-words font-semibold">Dear:</p>
            <p className=" text-start font-normal inline">Thu He - CEO</p>
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
                {info.label}:
              </p>
              <p className=" text-start font-normal">{info.value}</p>
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
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              You must choose a date range
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
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.reason}
            </span>
          )}
        </div>
        <div className="w-full gap-2 flex flex-col">
          <p className="text-start break-words font-semibold">Commitment:</p>
          <Textarea
            className="h-[100px]"
            name="commitment"
            value={formik.values.commitment}
            onChange={handleChange}
          />
          {errors.commitment && touched.commitment && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.commitment}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbsentForm;
