"use client";
import RegularButton from "src/components/regularButton";
import { DatePicker } from "src/components/datePicker";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { LeaveRequest } from "src/types/leaveRequestType";
import { Button } from "../../../../../../../@/components/ui/button";
import { cn } from "../../../../../../../@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useToast } from "../../../../../../../@/components/ui/use-toast";
import { useRouter } from "next13-progressbar";
import { User } from "src/types/userType";
import { useFormik } from "formik";
import { FormikDatePicker } from "src/components/formikDatePicker";
import { errorClassName } from "src/componentsClassName/errorClassName";
import { Textarea } from "../../../../../../../@/components/ui/textarea";
import { useSearchParams } from "next/navigation";

const absentFormSchema = yup.object({
  reason: yup
    .string()
    .required("Reason cannot be blank")
    .max(500, "Reason length must be less than 500 characters"),
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
const AbsentDetail = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const functionName = searchParams.get("functionName");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik(
    {
      initialValues: {
        reason: "",
        date: {
          from: new Date(),
          to: new Date(),
        },
      },
      validationSchema: absentFormSchema,

      onSubmit: async ({ reason, date }) => {
        const startDate = date.from;
        const endDate = date.to;

        setIsLoading(true);
        try {
          console.log({ startDate }, { endDate });
          const response = await axiosPrivate.put<LeaveRequest>(
            `/leaveRequest/` + params.id,
            {
              reason: reason,
              startDate: startDate,
              endDate: endDate,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log("success", JSON.stringify(response.data));
          router.push("/attendance/absent");
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
              description: [`Error message: ${err.response?.data.error}\t`],
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
      },
    }
    // }
  );

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;
  const handleApprove = async () => {
    try {
      const res = await axiosPrivate.put<LeaveRequest>(
        "/approverLeaveRequest/" + params.id,
        {
          newStatus: "approved",
        }
      );
      toast({
        title: `${leaveRequest?.userId.name}'s request has been accepted `,
      });
      router.back();
      console.log(res.data);
    } catch (e) {
      console.log({ e });
    }
  };
  const handleReject = async () => {
    try {
      const res = await axiosPrivate.put<LeaveRequest>(
        "/approverLeaveRequest/" + params.id,
        {
          newStatus: "denied",
        }
      );
      toast({
        title: `${leaveRequest?.userId.name}'s request has been rejected `,
      });
      // setLeaveRequest(res.data);
      router.back();
      console.log(res.data);
    } catch (e) {
      console.log({ e });
    }
  };
  const today = new Date();
  const { data: session } = useSession();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>();
  const [HRManager, setHRManager] = useState<User>();
  const [profile, setProfile] = useState<User>();
  const basicInformation = [
    { label: "Full name:", value: leaveRequest?.userId.name },
    { label: "Position:", value: profile?.positionId.name },
    { label: "Employee code:", value: leaveRequest?.userId.code },
    !session?.user.roles.includes(process.env.CEO)
      ? { label: "Department:", value: profile?.departmentId?.name }
      : undefined,
    { label: "Status:", value: leaveRequest?.status },
  ];

  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getUserProfile = async (_id: string) => {
      try {
        const res = await axiosPrivate.get<User>("/user/" + _id);
        console.log("user", res.data);
        setProfile(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    const getLeaveRequest = async (id: string) => {
      try {
        const res = await axiosPrivate.get<LeaveRequest>("/leaveRequest/" + id);
        res.data;
        setLeaveRequest(res.data);
        console.log(res.data);
        if (!profile && res.data.userId._id !== session?.user._id) {
          getUserProfile(res.data.userId._id);
        } else {
          setProfile(session?.user);
        }
      } catch (e) {
        console.error({ e });
      }
    };
    const getHRManager = async () => {
      try {
        const res = await axiosPrivate.get<User>("/hr-manager");
        setHRManager(res.data);
      } catch (e) {
        console.log({ e });
      }
    };

    getHRManager();
    getLeaveRequest(params.id);
  }, []);
  const isCurrentUser = (
    leaveRequestId?: string,
    leaveRequestStatus?: string
  ) => {
    if (
      leaveRequestId === session?.user._id &&
      leaveRequestStatus === "pending"
    )
      return true;
    else return false;
  };
  useEffect(() => {
    if (leaveRequest) {
      formik.initialValues.date.from = new Date(leaveRequest.startDate);
      formik.initialValues.date.to = new Date(leaveRequest.endDate);
      formik.initialValues.reason = leaveRequest.reason;
    }
    console.log("functionName", functionName);
  }, [leaveRequest]);
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
      {isCurrentUser(leaveRequest?.userId._id, leaveRequest?.status) &&
      functionName === "edit" ? (
        <>
          <div className="flex gap-3 self-end mb-2">
            {session?.user.roles.includes(process.env.HRManager) && (
              <>
                <RegularButton label="Approve" callback={handleApprove} />
              </>
            )}
          </div>
          <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start pt-8 pb-20 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
            <p className=" font-semibold text-2xl self-center mb-3 text-black dark:text-button">
              Application for Leave of Absence
            </p>
            <div className="flex justify-between w-full">
              <div className="flex text-[#5B5F7B] gap-2">
                <p className="inline text-start break-words font-semibold">
                  Dear:
                </p>
                <p className=" text-start font-normal inline">{`${HRManager?.name} - HRManager`}</p>
              </div>
              <div className="flex text-[#5B5F7B] gap-2">
                <p className="inline text-start break-words font-semibold">
                  Date:
                </p>
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
              <p className="text-start font-semibold inline">
                Requested day off:
              </p>
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
                <span className={errorClassName}>{errors.date.from}</span>
              )}
              {errors.date?.to && touched.date && (
                <span className={errorClassName}>{errors.date.to}</span>
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
                <span className={errorClassName}>{errors.reason}</span>
              )}
            </div>

            <div className="flex gap-3 self-end mt-2">
              <RegularButton
                label="Save"
                callback={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 self-end mb-2">
            {leaveRequest?.status === "pending" &&
              session?.user.roles.includes(process.env.HRManager) && (
                <>
                  <RegularButton label="Approve" callback={handleApprove} />
                  <RegularButton
                    label="Reject"
                    additionalStyle="bg-bar"
                    callback={handleReject}
                  />
                </>
              )}
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
                  {`${HRManager?.name} - HRManager`}
                </p>
              </div>
              <div className="flex text-[#5B5F7B] gap-2">
                <p className="inline text-start break-words font-semibold">
                  Date:
                </p>
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
              <p className="text-start font-semibold inline">
                Requested day off:
              </p>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal border rounded-lg w-3/4"
                )}
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {leaveRequest?.startDate &&
                  (leaveRequest?.endDate ? (
                    <>
                      {format(new Date(leaveRequest.startDate), "LLL dd, y")} -{" "}
                      {format(new Date(leaveRequest.endDate), "LLL dd, y")}
                    </>
                  ) : (
                    format(new Date(leaveRequest.startDate), "LLL dd, y")
                  ))}
              </Button>
            </div>
            <div className="w-full gap-2 flex flex-col">
              <p className="text-start break-words font-semibold">Reason:</p>
              <p>{leaveRequest?.reason}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AbsentDetail;
