"use client";
import { Input } from "@nextui-org/react";
import CustomDropdown from "src/components/customDropdown";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { Textarea } from "../../../../../../@/components/ui/textarea";
import { SearchIcon } from "src/svgs";
import { Label } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Allowances } from "src/types/allowancesType";
import { Holidays } from "src/types/holidaysType";
import { format, parse, parseISO } from "date-fns";
import { useRouter } from "next13-progressbar";

type AddAllowancesModalProps = {
    onClose: () => void;
    onSave: (updatedRow: Allowances) => void;
};
type AddHolidaysModalProps = {
    onClose: () => void;
    onSave: (updatedRow: Holidays) => void;
};
type EditAllowancesModalProps = {
    row: Allowances;
    onClose: () => void;
    onSave: (updatedRow: Allowances) => void;
};
type EditHolidaysModalProps = {
    row: Holidays;
    onClose: () => void;
    onSave: (updatedRow: Holidays) => void;
};
const Salary = () => {
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();
    const { toast } = useToast();

    const [type, setType] = useState<string>("allowances");
    const [requestAddAllowances, setRequestAddAllowances] = useState<boolean>(false);
    const [requestAddHolidays, setRequestAddHolidays] = useState<boolean>(false);
    const [allowances, setAllowances] = useState<Allowances[]>([]);
    const [holidays, setHolidays] = useState<Holidays[]>([]);
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [rows, setRows] = useState<any[]>(allowances);
    const [editableAllowancesRow, setEditableAllowancesRow] = useState<Allowances | null>(null);
    const [editableHolidaysRow, setEditableHolidaysRow] = useState<Holidays | null>(null);
    const typeList = [{ value: "allowances", name: "Allowances" }, { value: "holidays", name: "Holidays" }];
    const allowancesColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Code",
            type: ColumnEnum.filterColumn,
            key: "code",
        },
        {
            title: "Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Amount",
            type: ColumnEnum.textColumn,
            key: "amount",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const holidaysColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Day",
            type: ColumnEnum.filterColumn,
            key: "day",
        },
        {
            title: "Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    
    useEffect(() => {
        const getAllowances = async () => {
            try {
                const res = await axiosPrivate.get<Allowances[]>("/allowances");
                setAllowances(res.data);
                setColumns(allowancesColumns);
                setRows(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
    
        const getHolidays = async () => {
            try {
                const res = await axiosPrivate.get<Holidays[]>("/holidays");
                const formattedData = res.data.map((holiday) => ({
                    ...holiday,
                    day: format(parseISO(holiday.day), "dd/MM/yyyy"),
                }));
                setHolidays(formattedData);
                setColumns(holidaysColumns);
                setRows(formattedData);
            } catch (e) {
                console.log({ e });
            }
        };
    
        const fetchData = async () => {
            switch (type) {
                case "allowances":
                    if (allowances.length === 0) {
                        await getAllowances();
                    } else {
                        setColumns(allowancesColumns);
                        setRows(allowances);
                    }
                    break;
                case "holidays":
                    if (holidays.length === 0) {
                        await getHolidays();
                    } else {
                        setColumns(holidaysColumns);
                        setRows(holidays);
                    }
                    break;
                default:
                    break;
            }
        };
        fetchData(); 
    }, [type, allowances, holidays]);
    const onSubmitAllowances = async (updatedRow: Allowances) => {
        try {
            const res = await axiosPrivate.post<Allowances>(
                "/allowance",
                {
                    name: updatedRow.name,
                    code: updatedRow.code,
                    amount: updatedRow.amount
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
            const updatedAllowances = [...allowances, updatedRow];
            setAllowances(updatedAllowances);
            toast({
                title: `Add allowance successfully `,
                description: [
                    `name: ${updatedRow.name}\n`,
                    `code: ${updatedRow.code}\n`,
                    `amount: ${updatedRow.amount}\n`
                ]
            });
            setRequestAddAllowances(false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.status);
                toast({
                  title: `Error `,
                  description: e.response?.data?.error,
                });
              } else {
                console.log(e);
                toast({
                  title: `Error `,
                  description: "Something has went wrong, please try again",
                });
              }
        }
    };
    const onSubmitHolidays = async (updatedRow: Holidays) => {
        try {
            updatedRow.day = format(new Date(updatedRow.day), 'dd/MM/yyyy');
            const res = await axiosPrivate.post<Holidays>(
                "/holiday",
                {
                    name: updatedRow.name,
                    day: updatedRow.day
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
            const updatedHolidays = [...holidays, updatedRow];
            setHolidays(updatedHolidays);
            toast({
                title: `Add holiday successfully `,
                description: [
                    `name: ${updatedRow.name}\n`,
                    `day: ${updatedRow.day}`
                ]
            });
            setRequestAddHolidays(false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.status);
                toast({
                  title: `Error `,
                  description: e.response?.data?.error,
                });
              } else {
                console.log(e);
                toast({
                  title: `Error `,
                  description: "Something has went wrong, please try again",
                });
              }
        }
    };
    const handleAddNew = () => {
        switch (type) {
            case "allowances":
                setRequestAddAllowances(true);
                break;
            case "holidays":
                setRequestAddHolidays(true);
                break;
            default:
                break;
        }
    };
    const AddAllowancesModal: React.FC<AddAllowancesModalProps> = ({ onClose, onSave }) => {
        const [formState, setFormState] = useState<Partial<Allowances>>({});
        
        return (
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <div className="flex w-[40%] items-start py-10 gap-48 self-center">
                    <Input 
                        value={formState.code}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Code</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    />
                </div>
                <div className="flex w-full items-start py-10 gap-48">
                    <Input 
                        value={formState.name}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Name</p>}
                        labelPlacement={"outside-left"}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <Input 
                        value={formState.amount}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="money"
                        label={<p className="text-[#5B5F7B]">Amount</p>}
                        labelPlacement={"outside-left"}
                        onChange={(e) => setFormState({ ...formState, amount: e.target.value })}
                    />
                </div>
                
                <div className="flex gap-3 self-end mb-2">
                    <RegularButton label="Submit" callback={() => onSave(formState as Allowances)} />
                    <RegularButton
                        label="Close"
                        additionalStyle="bg-[#BDBDBD]"
                        callback={onClose}
                    />
                </div>
            </div>
        );
    };
    const AddHolidaysModal: React.FC<AddHolidaysModalProps> = ({ onClose, onSave }) => {
        const [formState, setFormState] = useState<Partial<Holidays>>({});
        
        return (
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <div className="flex w-full items-start py-10 gap-48">
                    <Input 
                        value={formState.name}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Name</p>}
                        labelPlacement={"outside-left"}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <Input 
                        value={formState.day}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="date"
                        label={<p className="text-[#5B5F7B]">Day</p>}
                        labelPlacement={"outside-left"}
                        onChange={(e) => setFormState({ ...formState, day: e.target.value })}
                    />
                </div>
                
                <div className="flex gap-3 self-end mb-2">
                    <RegularButton label="Submit" callback={() => onSave(formState as Holidays)} />
                    <RegularButton
                        label="Close"
                        additionalStyle="bg-[#BDBDBD]"
                        callback={onClose}
                    />
                </div>
            </div>
        );
    };
    const onSaveAllowances = async (updatedRow: Allowances) => {
        try {
            const res = await axiosPrivate.put<Allowances>(
                "/allowance/" + updatedRow._id,
                {
                    name: updatedRow.name,
                    amount: updatedRow.amount,
                    code: updatedRow.code,
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
            const updatedAllowances = allowances?.map((allowance) =>
                allowance._id === updatedRow._id ? updatedRow : allowance
            );
            setAllowances(updatedAllowances);
            toast({
                title: `Update allowance successfully `,
                description: [
                    `code: ${updatedRow.code}\n`,
                    `name: ${updatedRow.name}\n`,
                    `amount: ${updatedRow.amount}`
                ]
            });
            setEditableAllowancesRow(null);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.status);
                toast({
                  title: `Error `,
                  description: e.response?.data?.error,
                });
              } else {
                console.log(e);
                toast({
                  title: `Error `,
                  description: "Something has went wrong, please try again",
                });
              }
        }
    };
    const onSaveHolidays = async (updatedRow: Holidays) => {
        try {
            updatedRow.day = format(new Date(updatedRow.day), 'dd/MM/yyyy');
            const res = await axiosPrivate.put<Holidays>(
                "/holiday/" + updatedRow._id,
                {
                    name: updatedRow.name,
                    day: updatedRow.day
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
            const updatedHolidays = holidays?.map((holiday) =>
                holiday._id === updatedRow._id ? updatedRow : holiday
            );
            setHolidays(updatedHolidays);
            toast({
                title: `Update holiday successfully `,
                description: [
                    `name: ${updatedRow.name}\n`,
                    `day: ${updatedRow.day}`
                ]
            });
            setEditableHolidaysRow(null);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.status);
                toast({
                  title: `Error `,
                  description: e.response?.data?.error,
                });
              } else {
                console.log(e);
                toast({
                  title: `Error `,
                  description: "Something has went wrong, please try again",
                });
              }
        }
    };
    const handleEdit = (id: string) => {
        switch (type) {
            case "allowances":
                const rowForEditAllowances = allowances?.find((allowance) => allowance._id === id) || null;
                setEditableAllowancesRow(rowForEditAllowances);
                break;
            case "holidays":
                const rowForEditHolidays = holidays?.find((holiday) => holiday._id === id) || null;
                setEditableHolidaysRow(rowForEditHolidays);
                break;
            default:
                break;
        }
    };
    const EditAllowancesModal: React.FC<EditAllowancesModalProps> = ({ row, onClose, onSave }) => {
        const [formState, setFormState] = useState(row);
        
        return (
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <div className="flex w-[40%] items-start py-10 gap-48 self-center">
                    <Input 
                        value={formState.code}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Code</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    />
                </div>
                <div className="flex w-full items-start py-10 gap-48">
                    <Input 
                        value={formState.name}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Name</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <Input 
                        value={formState.amount}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="money"
                        label={<p className="text-[#5B5F7B]">Amount</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, amount: e.target.value })}
                    />
                </div>
                
                <div className="flex gap-3 self-end mb-2">
                    <RegularButton label="Save" callback={() => onSave(formState)} />
                    <RegularButton
                        label="Close"
                        additionalStyle="bg-[#BDBDBD]"
                        callback={onClose}
                    />
                </div>
            </div>
        );
    };
    const EditHolidaysModal: React.FC<EditHolidaysModalProps> = ({ row, onClose, onSave }) => {
        const [formState, setFormState] = useState(row);
        
        return (
            <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
                <div className="flex w-full items-start py-10 gap-48">
                    <Input 
                        value={formState.name}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="text"
                        label={<p className="text-[#5B5F7B]">Name</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <Input 
                        value={formState.day}
                        className="rounded w-auto flex-1"
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="date"
                        label={<p className="text-[#5B5F7B]">Day</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, day: e.target.value })}
                    />
                </div>
                
                <div className="flex gap-3 self-end mb-2">
                    <RegularButton label="Save" callback={() => onSave(formState)} />
                    <RegularButton
                        label="Close"
                        additionalStyle="bg-[#BDBDBD]"
                        callback={onClose}
                    />
                </div>
            </div>
        );
    };
    const deleteFunction = async (id: string) => {
        switch (type)
        {
            case "allowances":
                try {
                    const res = await axiosPrivate.delete<Allowances>(
                        "/allowance/" + id,
                        {
                            headers: { "Content-Type": "application/json" },
        
                            withCredentials: true,
                        }
                    );
                    console.log({ res });
                    const updatedAllowances = allowances.filter(allowance => allowance._id !== id);
                    setAllowances(updatedAllowances);
                    const allowance = allowances?.find((allowance) => allowance._id === id);
                    toast({
                        title: `Delete department successful `,
                        description: [
                            `code: ${allowance?.code}\n`,
                            `name: ${allowance?.name}\n`,
                            `amount: ${allowance?.amount}`
                        ]
                    });
                } catch (e) {
                    console.log({ e }, { id });
                    if (axios.isAxiosError(e)) {
                        console.log(e.status);
                        toast({
                          title: `Error `,
                          description: e.response?.data?.error,
                        });
                      } else {
                        console.log(e);
                        toast({
                          title: `Error `,
                          description: "Something has went wrong, please try again",
                        });
                      }
                }
                break;
                case "holidays":
                    try {
                        const res = await axiosPrivate.delete<Holidays>(
                            "/holiday/" + id,
                            {
                                headers: { "Content-Type": "application/json" },
            
                                withCredentials: true,
                            }
                        );
                        console.log({ res });
                        const updateHolidays = holidays.filter(holiday => holiday._id !== id);
                        setHolidays(updateHolidays);
                        const holiday = holidays?.find((holiday) => holiday._id === id);
                        toast({
                            title: `Delete department successful `,
                            description: [
                                `name: ${holiday?.name}\n`,
                                `day: ${holiday?.day}`
                            ]
                        });
                    } catch (e) {
                        console.log({ e }, { id });
                        if (axios.isAxiosError(e)) {
                            console.log(e.status);
                            toast({
                              title: `Error `,
                              description: e.response?.data?.error,
                            });
                          } else {
                            console.log(e);
                            toast({
                              title: `Error `,
                              description: "Something has went wrong, please try again",
                            });
                          }
                    }
                    break;
                default:
                    break;
        }
        router.refresh();
    }
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            {type === "allowances" ? (
            <>
                {editableAllowancesRow && (
                    <EditAllowancesModal
                        row={editableAllowancesRow}
                        onClose={() => setEditableAllowancesRow(null)}
                        onSave = {(updatedRow: Allowances) => {
                            onSaveAllowances(updatedRow)
                        }}
                    />
                )}
                {requestAddAllowances === true && (
                    <AddAllowancesModal
                        onClose={() => setRequestAddAllowances(false)}
                        onSave = {(updatedRow: Allowances) => {
                            onSubmitAllowances(updatedRow)
                        }}
                    />
                )}
            </>
            ):(
                <>
                {editableHolidaysRow && (
                    <EditHolidaysModal
                        row={editableHolidaysRow}
                        onClose={() => setEditableHolidaysRow(null)}
                        onSave = {(updatedRow: Holidays) => {
                            onSaveHolidays(updatedRow)
                        }}
                    />
                )}
                {requestAddHolidays === true && (
                    <AddHolidaysModal
                        onClose={() => setRequestAddHolidays(false)}
                        onSave = {(updatedRow: Holidays) => {
                            onSubmitHolidays(updatedRow)
                        }}
                    />
                )}
            </>
            )}
            <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Salary Component
                        </div>
                        <div className=" flex gap-4 w-[30%] items-end justify-between">
                            <CustomDropdown
                                label="Type"
                                placeholder="Select type"
                                additionalStyle="flex-1"
                                options={typeList}
                                onSelect={setType}
                                value={type}
                            />
                            <div className="flex">
                                <RegularButton
                                    label="add new"
                                    callback={handleAddNew}
                                    additionalStyle="min-w-[100px]"
                                />
                            </div>
                        </div>
                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={rows} 
                        deleteFunction={deleteFunction} editFunction={handleEdit}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Salary;
