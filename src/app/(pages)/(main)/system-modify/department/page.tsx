"use client";
import { Avatar,
    Input,
    Listbox,
    ListboxItem,
    Selection,
    useDisclosure, } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import {Key, useState, useEffect } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import RegularButton from "src/components/regularButton";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import { Department, User } from "src/types/userType";

type dDepartment = Department & {
    manager: string;
};
type Employee = User & {
    createdAt: string;
    department?: string;
  };
type EditModalProps = {
    row: dDepartment;
    onClose: () => void;
    onSave: (updatedRow: dDepartment) => void;
};

const Department = () => {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [employees, setEmployees] = useState<Employee[]>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [selectedEmpId, setSelectedEmpId] = useState<string>();
    const [values, setValues] = useState<Selection>();
    const [editableRow, setEditableRow] = useState<dDepartment | null>(null);

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                res.data.map((dept) => dept.manager = dept.managerId.name);
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getEmployees = async () => {
            try {
              const res = await axiosPrivate.get<Employee[]>("/all-user", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              });
              setEmployees(res.data);
            } catch (e) {
              console.log({ e });
            }
          };
        getEmployees();
        getDepartments();
    }, []);
    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Department Code",
            type: ColumnEnum.textColumn,
            key: "code",
        },
        {
            title: "Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Manager",
            type: ColumnEnum.textColumn,
            key: "manager",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const viewDepartment = (id: string) => {
        router.replace("/system-modify/department-details?id=" + id);
    };
    const onSave = async (updatedRow: dDepartment) => {
        try {
            
            const res = await axiosPrivate.put<dDepartment>(
                "/department/" + updatedRow._id,
                {
                    managerId: updatedRow.managerId._id,
                    name: updatedRow.name
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
            
            const updatedDepartments = departments?.map((department) =>
                department._id === updatedRow._id ? updatedRow : department
            );
            setDepartments(updatedDepartments);
            setEditableRow(null);
        } catch (e) {
            console.log({ e });
        }
        
    };
    const handleEdit = (id: string) => {
        const rowForEdit = departments?.find((department) => department._id === id) || null;
        setEditableRow(rowForEdit);
    };
    const rows = () => {
        let sortedEmp = employees;
        if (searchQuery) {
          sortedEmp = sortedEmp?.filter(
            (emp) =>
              emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              emp.code.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return sortedEmp;
      };
    const EditModal: React.FC<EditModalProps> = ({ row, onClose, onSave }) => {
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
                        label={<p className="text-[#5B5F7B]">Department name</p>}
                        labelPlacement={"outside"}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <div className="flex flex-1 flex-col">
                        <Input
                            className="rounded w-auto flex-1"
                            classNames={{
                            inputWrapper: "bg-white border",
                            }}
                            radius="sm"
                            variant="bordered"
                            key={"a"}
                            type="text"
                            placeholder="Search"
                            labelPlacement={"outside"}
                            label={<p className="text-[#5B5F7B] font-medium">Manager code</p>}
                            endContent={
                            <div className="bg-black p-1 rounded opacity-80">
                                <SearchIcon />
                            </div>
                            }
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                const selectedEmployee = employees?.find((employee) => employee._id === selectedEmpId);
                                setFormState({ 
                                    ...formState, 
                                    manager: selectedEmployee?.name ?? '' 
                                });
                            }}
                        />
                        {rows() && (
                            <Listbox
                            // topContent={topContent}
                            classNames={{
                                base: "max-w-full",
                                list: "max-h-[300px] w-full overflow-y-scroll",
                            }}
                            // defaultSelectedKeys={["1"]}
                            items={rows()}
                            label="Assigned to"
                            selectionMode="single"
                            onSelectionChange={(key) => {
                                setValues(key);
                                let selectedArray: Key[] = [];
                                if (key instanceof Set) {
                                selectedArray = Array.from(key);
                                }
                                setSelectedEmpId(selectedArray[0]?.toString() || undefined);
                            }}
                            variant="flat"
                            >
                            {(item) => (
                                <ListboxItem key={item._id} textValue={item.name}>
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                    alt={item.name}
                                    className="flex-shrink-0"
                                    size="sm"
                                    src={item.avatarImage}
                                    />
                                    <div className="flex flex-col">
                                    <span className="text-small">{item.name}</span>
                                    <span className="text-tiny text-default-400">
                                        {item.code}
                                    </span>
                                    </div>
                                </div>
                                </ListboxItem>
                            )}
                            </Listbox>
                        )}
                    </div>
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
    
    const deleteDepartment = async (id: string) => {
        try {
            const res = await axiosPrivate.delete<dDepartment>(
                "/department/" + id,
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            console.log({ res });
        } catch (e) {
            console.log({ e },{id});
        }
    }
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            {editableRow && (
                <EditModal
                    row={editableRow}
                    onClose={() => setEditableRow(null)}
                    onSave = {(updatedRow: dDepartment) => {
                        onSave(updatedRow)
                    }}
                />
            )}
            <div className="flex flex-1 flex-col w-full items-center rounded ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Department Management
                        </div>                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={departments} editFunction={handleEdit}
                            viewFunction={viewDepartment} deleteFunction={deleteDepartment}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Department;
