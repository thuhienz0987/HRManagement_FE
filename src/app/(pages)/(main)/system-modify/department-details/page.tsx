"use client";
import {
  Avatar,
  Input,
  Listbox,
  ListboxItem,
  Selection,
} from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import TableFirstForm, {
  ColumnEnum,
  ColumnType,
} from "src/components/tableFirstForm";
import { SearchIcon } from "src/svgs";
import { Team, User } from "src/types/userType";
import RegularButton from "src/components/regularButton";
import { useRouter } from "next13-progressbar";
import { useSession } from "next-auth/react";
import allowRows from "src/helper/allowRoles";

type Employee = User & {
  createdAt: string;
  department?: string;
  team?: string;
};

type dTeam = Team & {
  value: string;
  departmentName: string;
  leader: string;
  leader_id: string;
};

type EditModalProps = {
  row: dTeam;
  onClose: () => void;
  onSave: (updatedRow: dTeam) => void;
};

const DepartmentDetails = () => {
  const { data: session } = useSession();

  const axiosPrivate = useAxiosPrivate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const _id = searchParams.get("id");
  const { toast } = useToast();

  const [depEmployees, setDepEmployees] = useState<Employee[]>();
  const [teams, setTeams] = useState<dTeam[]>();
  const [sortedDept, setSortedDept] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [editableRow, setEditableRow] = useState<dTeam | null>(null);
  useEffect(() => {
    const getDevEmployees = async (departmentId: string) => {
      try {
        const res = await axiosPrivate.get<Employee[]>(
          `/department-member/` + departmentId,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        res.data.map((employee) => {
          employee.createdAt = format(
            parseISO(employee.createdAt),
            "dd/MM/yyyy"
          );
          employee.department = employee?.departmentId?.name;
          employee.team = employee?.teamId?.name;
        });
        setDepEmployees(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    const getTeams = async (departmentId: string) => {
      try {
        const res = await axiosPrivate.get<dTeam[]>(`/teams/` + departmentId, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        res.data.map((team) => {
          (team.value = team.name),
            (team.leader = team.managerId.name),
            (team.departmentName = team.departmentId.name);
        });
        setTeams(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    if (_id) {
      getTeams(_id);
      getDevEmployees(_id);
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

  const teamColumnsForEmployee: ColumnType[] = [
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
    let sortedEmp = depEmployees;
    if (searchQuery) {
      sortedEmp = sortedEmp?.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortedDept) {
      sortedEmp = sortedEmp?.filter((emp) => emp?.teamId?.name == sortedDept);
    }
    return sortedEmp;
  };
  const generateTeamCode = (TeamName: string, DepartmentName: string) => {
    const cleanedTeamName = TeamName.toUpperCase().replace(/\s/g, "");
    const cleanedDepartmentName = DepartmentName.toUpperCase().replace(
      /\s/g,
      ""
    );
    const TeamCode =
      cleanedDepartmentName.substring(0, 3) +
      "_" +
      cleanedTeamName.substring(0, 3);

    return TeamCode;
  };
  const onSave = async (updatedRow: dTeam) => {
    try {
      const res = await axiosPrivate.put<dTeam>(
        "/team/" + updatedRow._id,
        {
          managerId: updatedRow.leader_id,
          name: updatedRow.name,
          departmentId: updatedRow.departmentId._id,
        },
        {
          headers: { "Content-Type": "application/json" },

          withCredentials: true,
        }
      );
      console.log({ res });
      updatedRow.code = generateTeamCode(
        updatedRow.name,
        updatedRow.departmentName
      );
      const updatedTeams = teams?.map((team) =>
        team._id === updatedRow._id ? updatedRow : team
      );
      setTeams(updatedTeams);
      setEditableRow(null);
      toast({
        title: `Update team successful `,
        description: [
          `departmentName: ${updatedRow.departmentName}\n`,
          `teamName: ${updatedRow.name}\n`,
          `leader: ${updatedRow.leader}`,
        ],
      });
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
  const editTeam = (id: string) => {
    const rowForEdit = teams?.find((team) => team._id === id) || null;
    setEditableRow(rowForEdit);
  };
  const deleteTeam = async (id: string) => {
    try {
      const res = await axiosPrivate.delete<dTeam>("/team/" + id, {
        headers: { "Content-Type": "application/json" },

        withCredentials: true,
      });
      console.log({ res });
    } catch (e) {
      console.log({ e }, { id });
    }
  };
  const viewEmployee = (id: string) => {
    router.push("/account/profile?id=" + id);
  };
  const editEmployee = (id: string) => {
    router.push("/account/edit-profile?id=" + id);
  };
  const deleteEmployee = async (id: string) => {
    try {
      const res = await axiosPrivate.delete<dTeam>("/deleteUser/" + id, {
        headers: { "Content-Type": "application/json" },

        withCredentials: true,
      });
      console.log({ res });
    } catch (e) {
      console.log({ e }, { id });
    }
  };
  const EditModal: React.FC<EditModalProps> = ({ row, onClose, onSave }) => {
    const [employees, setEmployees] = useState<Employee[]>();
    const [selectedEmpId, setSelectedEmpId] = useState<string>();
    const [values, setValues] = useState<Selection>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [formState, setFormState] = useState(row);
    const search = () => {
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
    useEffect(() => {
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
    }, []);
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
            label={<p className="text-[#5B5F7B]">Team name</p>}
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
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
              label={<p className="text-[#5B5F7B] font-medium">Leader</p>}
              endContent={
                <div className="bg-black p-1 rounded opacity-80">
                  <SearchIcon />
                </div>
              }
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            {search() && (
              <Listbox
                // topContent={topContent}
                classNames={{
                  base: "max-w-full",
                  list: "max-h-[300px] w-full overflow-y-scroll",
                }}
                // defaultSelectedKeys={["1"]}
                items={search()}
                label="Assigned to"
                selectionMode="single"
                onSelectionChange={(key) => {
                  setValues(key);
                  let selectedArray: Key[] = [];
                  if (key instanceof Set) {
                    selectedArray = Array.from(key);
                  }
                  setSelectedEmpId(selectedArray[0]?.toString() || undefined);
                  const selectedEmployee = employees?.find(
                    (employee) => employee._id === selectedArray[0]?.toString()
                  );
                  console.log({ selectedEmployee });
                  setFormState({
                    ...formState,
                    leader_id: selectedArray[0]?.toString() || "",
                    leader: selectedEmployee?.name || "",
                  });
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

  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
      {editableRow && (
        <EditModal
          row={editableRow}
          onClose={() => setEditableRow(null)}
          onSave={(updatedRow: dTeam) => {
            onSave(updatedRow);
          }}
        />
      )}
      <div className="flex flex-1 flex-col w-full items-center rounded gap-y-11 ">
        <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
          <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
            <div className="text-[#2C3D3A] block text-3xl font-semibold">
              Team Management
            </div>
          </div>
          <div className="w-[95%] self-center flex">
            {allowRows(
              [process.env.HRManager, process.env.CEO],
              session?.user.roles || []
            ) ? (
              <TableFirstForm
                columns={teamColumns}
                rows={teams}
                editFunction={editTeam}
              />
            ) : (
              <TableFirstForm columns={teamColumnsForEmployee} rows={teams} />
            )}
          </div>
        </div>
        {allowRows(
          [
            process.env.HRManager,
            process.env.CEO,
            process.env.DepartmentManager,
          ],
          session?.user.roles || []
        ) && (
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
              <TableFirstForm
                columns={employeeColumns}
                rows={rows()}
                viewFunction={viewEmployee}
                editFunction={editEmployee}
                // deleteFunction={deleteEmployee}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetails;
