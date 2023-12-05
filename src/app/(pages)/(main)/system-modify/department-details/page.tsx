"use client";
import { Input } from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import { Team, User } from "src/types/userType";

type Employee = User & {
    createdAt: string;
    department?: string;
    team?: string;
};

type dTeam = Team & {
    value: string;
    leader: string
};

const DepartmentDetails = () => {
    const axiosPrivate = useAxiosPrivate();
    const searchParams = useSearchParams();
    const _id = searchParams.get("id");
    const [employees, setEmployees] = useState<Employee[]>();
    const [teams, setTeams] = useState<dTeam[]>();
    const [sortedDept, setSortedDept] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>();
    useEffect(() => {
        const getEmployees = async (departmentId: string) => {
            try {
                const res = await axiosPrivate.get<Employee[]>(`/department-member/` + departmentId, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                res.data.map((employee) => {
                    employee.createdAt = format(
                        parseISO(employee.createdAt),
                        "dd/MM/yyyy"
                    );
                    employee.department = employee?.departmentId?.name;
                    employee.team = employee?.teamId?.name;
                });
                setEmployees(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getTeams = async (departmentId: string) => {
            try {
                const res = await axiosPrivate.get<dTeam[]>(
                    `/teams/` + departmentId, {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                res.data.map((team) => {
                    team.value = team.name,
                    team.leader = team.managerId.name
                });
                setTeams(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        if(_id)
        {
            getTeams(_id);
            getEmployees(_id);
        }
        
    }, []);
    const teamColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Team Code",
            type: ColumnEnum.textColumn,
            key: "code",
        },
        {
            title: "Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Leader",
            type: ColumnEnum.textColumn,
            key: "leader",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const employeeColumns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
            key: "no",
        },
        {
            title: "Employee Code",
            type: ColumnEnum.textColumn,
            key: "code",
        },
        {
            title: "Full Name",
            type: ColumnEnum.textColumn,
            key: "name",
        },
        {
            title: "Team",
            type: ColumnEnum.textColumn,
            key: "team",
        },
        {
            title: "Department",
            type: ColumnEnum.textColumn,
            key: "department",
        },
        {
            title: "Started Date",
            type: ColumnEnum.textColumn,
            key: "createdAt",
        },
        {
            title: "Action",
            type: ColumnEnum.functionColumn,
            key: "action",
        },
    ];
    const rows = () => {
        let sortedEmp = employees;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (emp) =>
                    emp.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    emp.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (emp) => emp?.teamId?.name == sortedDept
            );
        }
        return sortedEmp;
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Team Management
                        </div>                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={teamColumns} rows={teams}/>
                    </div>
                </div>
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Employee Management
                        </div>
                        <div className=" flex gap-x-3 items-end">
                            <Input
                                className="rounded w-auto flex-1"
                                classNames={{
                                    inputWrapper: "bg-white border",
                                }}
                                radius="sm"
                                variant="bordered"
                                key={"a"}
                                type="email"
                                placeholder="Search"
                                labelPlacement={"outside"}
                                endContent={
                                    <button className="bg-black p-1 rounded">
                                        <SearchIcon />
                                    </button>
                                }
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <CustomDropdown
                                label=""
                                placeholder="Select team"
                                additionalStyle="flex-1"
                                options={teams}
                                onSelect={setSortedDept}
                                value={sortedDept}
                            />
                        </div>
                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={employeeColumns} rows={rows()}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetails;
