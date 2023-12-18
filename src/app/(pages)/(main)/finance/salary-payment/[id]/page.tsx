"use client";
import { useEffect, useState } from "react";
import { Checkbox, Input } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import RegularButton from "src/components/regularButton";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { useToast } from "../../../../../../../@/components/ui/use-toast";
import { Salary } from "src/types/salaryTypes";
import { Allowances } from "src/types/allowancesType";
import allowRows from "src/helper/allowRoles";
import { useSession } from "next-auth/react";


type dSalary = Salary & {
    rate: number;
    comment: string;
    allowanceName: string[];
    allowanceMoney: string[]
};

type dAllowances = Allowances & {
    value: string;
};

const SalaryDetails = ({
    params,
}: {
    params: {
        id: string;
    };
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [salary, setSalary] = useState<dSalary>();
    const [allowances, setAllowances] = useState<dAllowances[]>();
    const [idAllowance, setIdAllowance] = useState<string[]>();
    const [isLoading, setIsLoading] = useState(false);
    const allowanceName: string[] = [];
    const [allowanceMoney, setAllowanceMoney] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalSalary, setTotalSalary] = useState<number>(0);
    const { toast } = useToast();
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        const getSalary = async (_id: string) => {
            try {
                const res = await axiosPrivate.get<dSalary>(
                    "/salary/" + _id
                );
                console.log(res.data);
                res.data.rate = res.data.idComment ? res.data.idComment.rate : 0;
                res.data.comment = res.data.idComment ? res.data.idComment.comment : "There are no comments yet";
                res.data.allowanceName = res.data.idAllowance.map((allowance) => allowance.name);
                res.data.allowanceMoney = res.data.idAllowance.map((allowance) => allowance.amount);
                setIdAllowance(Array.from(new Set(res.data.idAllowance.map((allowance) => allowance._id))));
                setSalary(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getAllowances = async () => {
            try {
                const res = await axiosPrivate.get<dAllowances[]>(
                    "/allowances"
                );
                res.data.map((a) => (a.value = a._id));
                setAllowances(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        console.log(params.id);
        getSalary(params.id);
        getAllowances();
    }, []);
    useEffect(() => {
        console.log({idAllowance});        
        idAllowance?.map(id => {
            allowances?.map(allowance => allowance._id === id && allowanceName.push(allowance.name))
        });
        let totalAllowanceMoney = 0;
        let totalIncomeMoney = 0;
        let totalSalaryMoney = 0;
        if (idAllowance && allowances && salary) {
            idAllowance.forEach((id) => {
                const allowance = allowances.find((allow) => allow._id === id);
                if (allowance) {
                    totalAllowanceMoney += parseFloat(allowance.amount);
                }
            });
            setAllowanceMoney(totalAllowanceMoney);
            totalIncomeMoney = parseFloat(salary.dayMoney) + totalAllowanceMoney 
            + parseFloat(salary.bonusMoney) + parseFloat(salary.overTimeMoney) 
            + parseFloat(salary.overTimeDayMoney) + parseFloat(salary.paidLeaveDaysMoney);
            totalSalaryMoney = totalIncomeMoney - parseFloat(salary.incomeTaxAmount);
            setTotalIncome(totalIncomeMoney);
            setTotalSalary(totalSalaryMoney);
        }
        console.log({allowanceName});
    }, [idAllowance, allowances]);
    const totalColumns = [
        {
            title: "No",
            key: "no",
        },
        {
            title: "Details",
            key: "details",
        },
        {
            title: "Amount",
            key: "amount",
        },
        {
            title: "Note",
            key: "note",
        }
    ];
    const totalRows = [
        {
            no: 1,
            calculation: "summation",
            details: "Salary for present days",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.dayMoney ?? '0'))}`,
            note: `${salary?.presentDate} days`
        },
        {
            no: 2,
            calculation: "summation",
            details: "Allowance",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(allowanceMoney)}`,
            // amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            // .format(parseFloat(salary?.allowanceAmount ?? '0'))}`,
            note: `${allowanceName.join(", ")}`
            // note: ""
        },
        {
            no: 3,
            calculation: "summation",
            details: "Bonus",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.bonusMoney ?? '0'))}`,
            note: `bonus: ${salary?.bonus.map(b => b).join(", ")}`
        },
        {
            no: 4,
            calculation: "summation",
            details: "Salary for over time hours",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.overTimeMoney ?? '0'))}`,
            note: `${salary?.overTime} hours`
        },
        {
            no: 5,
            calculation: "summation",
            details: "Salary for over time days",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.overTimeDayMoney ?? '0'))}`,
            note: `${salary?.overTimeDay} days`
        },
        {
            no: 6,
            calculation: "summation",
            details: "Salary for days off is included in the salary",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.paidLeaveDaysMoney ?? '0'))}`,
            note: `${salary?.paidLeaveDays} days`
        },
        {
            no: 7,
            calculation: "summation",
            details: "Total income",
            amount: `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(totalIncome)}`,
            note: ""
        },
        {
            no: 8,
            calculation: "subtraction",
            details: "Tax",
            amount: `-${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(parseFloat(salary?.incomeTaxAmount ?? '0'))}`,
            note: `${salary?.incomeTax}%`
        },
    ];
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, allowanceId: string) => {
        if (event.target.checked) {
          // Add the selected allowance to the idAllowance array
          setIdAllowance((prevIdAllowance: string[] | undefined) => [
            ...(prevIdAllowance || []),
            allowanceId,
          ]);
        } else {
          // Remove the allowance from the idAllowance array if unchecked
          setIdAllowance((prevIdAllowance: string[] | undefined) =>
            prevIdAllowance ? prevIdAllowance.filter((id) => id !== allowanceId) : []
          );
        }
    };
    const handleSubmit = async() => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.put(
                `/salary/${params.id}`,
                JSON.stringify({idAllowance}),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("success", JSON.stringify(response.data));
            router.push("/finance/salary-payment");
            toast({
                title: `${salary?.userId.name}'s salary has been updated `,
                description: format(
                    new Date(),
                    "EEEE, MMMM dd, yyyy 'at' h:mm a"
                ),
            });
        } catch (err) {
            console.log("err", err);
            toast({
                title: `${salary?.userId.name}'s salary has not been updated yet due to error `,
                description: format(
                    new Date(),
                    "EEEE, MMMM dd, yyyy 'at' h:mm a"
                ),
            });
            //   setTitle('Error');
            //   setMessage(err.response.data.error);
            //   setLoading(false);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            {allowRows([process.env.HRManager], session?.user.roles || []) && (
                <div className="flex gap-3 self-end mb-2">
                    <RegularButton
                        label="Submit"
                        additionalStyle=""
                        callback={handleSubmit}
                        isLoading={isLoading}
                    />
                    {/* <RegularButton
                        label="cancel"
                        additionalStyle="bg-[#BDBDBD]"
                        callback={moveToEditScreen}
                    /> */}
                </div>
            )}
            {/* Basic information */}
            <div className=" w-11/12 rounded-lg flex bg-white flex-col md:flex-row">
                <div className="flex flex-1 flex-col items-center">
                    <div className="flex flex-col ">
                        <div className="flex mt-[20%] items-end flex-col justify-end">
                            <img
                                src={salary?.userId.avatarImage}
                                alt="Employee avatar"
                                className="h-[200px] w-[200px] rounded-full object-cover"
                            />
                        </div>
                    </div>
                    {allowRows([process.env.HRManager], session?.user.roles || []) && (
                        <div className="flex text-[#5B5F7B] gap-10 flex-col mt-7 ml-7">
                            <p className="inline text-start break-words font-semibold">List of allowances:</p>
                            {allowances?.map((allowance) => (
                            <div className="w-full gap-2 flex flex-row items-center" key={allowance._id}>
                                <Checkbox
                                color="warning" isSelected={idAllowance?.includes(allowance._id)}
                                onChange={(event) => handleCheckboxChange(event, allowance._id)}
                                />
                                <p className="text-start break-words font-semibold">
                                {`${allowance.name}: ${new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(parseFloat(allowance.amount))}`}
                                </p>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-[2_2_0%] flex-col">
                    <div className="md:grid flex flex-col grid-cols-1 md:grid-cols-2 md:grid-flow-row w-full pt-16 pb-3 px-5 gap-y-5 gap-x-7">
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Full name:</p>
                            <p className="text-start font-normal inline">{salary?.userId.name}</p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Employee code:</p>
                            <p className=" text-start font-normal inline">
                            {salary?.userId.code}
                            </p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Department:</p>
                            <p className="text-start font-normal inline">{salary?.userId.departmentId.name}</p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Position:</p>
                            <p className=" text-start font-normal inline">
                            {salary?.idPosition.name}
                            </p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Performance rate:</p>
                            <p className=" text-start font-normal inline">
                            {salary?.rate}
                            </p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Comment:</p>
                            <p className=" text-start font-normal inline">
                            {salary?.comment}
                            </p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Absent without permission:</p>
                            <p className=" text-start font-normal inline">
                            {`${(salary?.totalLeaveRequest ?? 0) - (salary?.paidLeaveDays ?? 0)} days`}
                            </p>
                        </div>
                        <div className="flex text-[#5B5F7B] gap-10">
                            <p className="inline text-start break-words font-semibold">Number of absent date:</p>
                            <p className=" text-start font-normal inline">
                            {`${salary?.totalLeaveRequest} days`}
                            </p>
                        </div>
                    </div>  
                    <div className="flex flex-1 flex-row">
                    <table className="border-[rgba(194, 201, 250, 1)] border-[2px] w-[90%] mt-5 flex flex-col mb-10">
                        <tbody>
                        <tr className="font-sans text-[#2C3D3A] text-xs h-12 bg-[#ffffff] flex w-full">
                            {totalColumns.map((column, index) => (
                                <th
                                key={index}
                                className={`border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300 ${
                                    column.title === "No" ? "w-[10]" : "" // Adjust the width for the "No" column
                                }`}
                                >
                                {column.title}
                                </th>
                            ))}
                        </tr>
                        {totalRows.map((data, index) => (
                            <tr key={index} className="font-sans text-[#2C3D3A] text-xs h-12 bg-[#ffffff] flex w-full">
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300" style={{ width: "3rem" }}>
                                {data.no}
                                </td>
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300">{data.details}</td>
                                <td
                                className={`border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300 ${
                                    data.calculation === "summation" ? "text-bar" : data.calculation === "subtraction" ? "text-red-500" : ""
                                }`}
                                >
                                {data.amount}
                                </td>
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300">{data.note}</td>
                            </tr>
                        ))}
                            <tr className="font-sans text-[#2C3D3A] text-xs h-12 bg-bar flex w-full">
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300"></td>
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 
                                p-2 border-slate-300 text-button font-bold">Total</td>
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 
                                p-2 border-slate-300 text-button font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                .format(totalSalary)}</td>
                                <td className="border-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300"></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryDetails;
