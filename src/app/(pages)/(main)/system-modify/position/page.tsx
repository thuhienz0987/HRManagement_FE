"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@nextui-org/react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
  ColumnEnum,
  ColumnType,
} from "src/components/tableFirstForm";
import { Position } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import RegularButton from "src/components/regularButton";
import { useSession } from "next-auth/react";
import allowRows from "src/helper/allowRoles";

type EditModalProps = {
  row: Position;
  onClose: () => void;
  onSave: (updatedRow: Position) => void;
};
const Position = () => {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [positions, setPositions] = useState<Position[]>();
  const [editableRow, setEditableRow] = useState<Position | null>(null);

  useEffect(() => {
    const getPositions = async () => {
      try {
        const res = await axiosPrivate.get<Position[]>("/positions");
        setPositions(res.data);
      } catch (e) {
        console.log({ e });
      }
    };
    getPositions();
  }, []);
  const columns: ColumnType[] = [
    {
      title: "No",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Position Code",
      type: ColumnEnum.textColumn,
      key: "code",
    },
    {
      title: "Name",
      type: ColumnEnum.textColumn,
      key: "name",
    },
    {
      title: "Basic Salary",
      type: ColumnEnum.textColumn,
      key: "basicSalary",
    },
    {
      title: "Action",
      type: ColumnEnum.functionColumn,
      key: "action",
    },
  ];

  const columnsForEmployee: ColumnType[] = [
    {
      title: "No",
      type: ColumnEnum.indexColumn,
      key: "no",
    },
    {
      title: "Position Code",
      type: ColumnEnum.textColumn,
      key: "code",
    },
    {
      title: "Name",
      type: ColumnEnum.textColumn,
      key: "name",
    },
    {
      title: "Basic Salary",
      type: ColumnEnum.textColumn,
      key: "basicSalary",
    },
  ];
  const onSave = async (updatedRow: Position) => {
    try {
      const res = await axiosPrivate.put<Position>(
        "/position/" + updatedRow._id,
        {
          basicSalary: updatedRow.basicSalary,
          name: updatedRow.name,
          code: updatedRow.code,
        },
        {
          headers: { "Content-Type": "application/json" },

          withCredentials: true,
        }
      );
      console.log({ res });
      const updatedDepartments = positions?.map((position) =>
        position._id === updatedRow._id ? updatedRow : position
      );
      setPositions(updatedDepartments);
      toast({
        title: `Update department successfully `,
        description: [
          `code: ${updatedRow.code}\n`,
          `name: ${updatedRow.name}\n`,
          `basicSalary: ${updatedRow.basicSalary}`,
        ],
      });
      setEditableRow(null);
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
    const rowForEdit =
      positions?.find((position) => position._id === id) || null;
    setEditableRow(rowForEdit);
  };
  const EditModal: React.FC<EditModalProps> = ({ row, onClose, onSave }) => {
    const [formState, setFormState] = useState(row);

    return (
      <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start pt-8 pb-20 mb-8 px-28 gap-4 text-[#5B5F7B] text-sm shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg">
        <div className="flex w-[40%] items-start py-10 gap-48 self-center">
          <Input
            value={formState.code}
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="text"
            label={<p className="text-[#5B5F7B] dark:text-whiteOff">Code</p>}
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, code: e.target.value })
            }
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
            label={<p className="text-[#5B5F7B] dark:text-whiteOff ">Name</p>}
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
          <Input
            value={formState.basicSalary}
            className="rounded w-auto flex-1"
            radius="sm"
            variant="bordered"
            key={"a"}
            type="money"
            label={
              <p className="text-[#5B5F7B] dark:text-whiteOff">Basic salary</p>
            }
            labelPlacement={"outside"}
            onChange={(e) =>
              setFormState({ ...formState, basicSalary: e.target.value })
            }
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
  return (
    <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
      {editableRow && (
        <EditModal
          row={editableRow}
          onClose={() => setEditableRow(null)}
          onSave={(updatedRow: Position) => {
            onSave(updatedRow);
          }}
        />
      )}
      <div className="flex flex-1 flex-col w-full items-center rounded ">
        <div className="flex flex-1 flex-col bg-white dark:bg-dark w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
          <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
            <div className="text-[#2C3D3A] dark:text-button block text-3xl font-semibold">
              Position Management
            </div>
          </div>
          <div className="w-[95%] self-center flex">
            {allowRows(
              [process.env.HRManager, process.env.CEO],
              session?.user.roles || []
            ) ? (
              <TableFirstForm
                columns={columns}
                rows={positions}
                editFunction={handleEdit}
              />
            ) : (
              <TableFirstForm columns={columnsForEmployee} rows={positions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Position;
