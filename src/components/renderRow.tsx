import { useEffect, useState } from "react";
import { ColumnEnum, ColumnType } from "./tableFirstForm";
import { Checkbox, Tooltip } from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "src/svgs";

export function RenderRow({
  row,
  index,
  checkedAll,
  columns,
  viewFunction,
  editFunction,
  deleteFunction,
  salaryFunction,
}: {
  row: any;
  index: number;
  checkedAll: boolean;
  columns: ColumnType[];
  viewFunction?: (id: string) => void;
  editFunction?: (id: string) => void;
  deleteFunction?: (id: string) => void;
  salaryFunction?: (id: string) => void;
}) {
  const [checkedItem, setCheckedItem] = useState(false);
  useEffect(() => {
    setCheckedItem(checkedAll);
  }, [checkedAll]);
  return (
    <>
      {columns.map((column) => (
        <th
          key={column.key}
          className={`${
            index % 2
              ? "bg-[#E9EFF2] dark:bg-[#404338]"
              : "bg-white dark:bg-[#6b6e5e]"
          } ${column.type == ColumnEnum.indexColumn && "flex-[0.5_1_0%]"} ${
            column.type == ColumnEnum.indexWithCheckBox && "flex-[0.5_1_0%]"
          } flex flex-row flex-1 gap-1 p-2 border-x-[1px] border-slate-300 dark:border-button items-center text-[#2C3D3A] dark:text-whiteOff font-normal text-xs min-w-[110px]`}
        >
          {column.type == ColumnEnum.indexColumn && (
            <p className="text-xs text-gray-600 dark:text-whiteOff">
              {index + 1}
            </p>
          )}
          {column.type == ColumnEnum.indexWithCheckBox && (
            <>
              <Checkbox
                size="sm"
                color="default"
                classNames={{
                  label: "text-xs text-gray-600",
                  base: " self-start",
                }}
                onClick={() => setCheckedItem(!checkedItem)}
                isSelected={checkedItem}
              >
                {index + 1}
              </Checkbox>
            </>
          )}
          {column.type == ColumnEnum.textColumn && (
            <p className=" text-left">{row[column.key as keyof typeof row]}</p>
          )}
          {column.type == ColumnEnum.filterColumn && (
            <p className=" text-left">{row[column.key as keyof typeof row]}</p>
          )}
          {column.type == ColumnEnum.functionColumn && (
            <div className="relative flex items-center gap-2">
              {viewFunction && (
                <Tooltip content="Details">
                  <button
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      viewFunction(row._id);
                    }}
                  >
                    <EyeIcon width="16" height="16" stroke="#ffffff" />
                  </button>
                </Tooltip>
              )}
              {editFunction && (
                <Tooltip content="Edit">
                  <button
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      editFunction(row._id);
                    }}
                  >
                    <EditIcon width="16" height="16" />
                  </button>
                </Tooltip>
              )}
              {deleteFunction && (
                <Tooltip color="danger" content="Delete">
                  <button
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                    onClick={() => {
                      deleteFunction(row._id);
                    }}
                  >
                    <DeleteIcon width="16" height="16" />
                  </button>
                </Tooltip>
              )}
              {salaryFunction && (
                <Tooltip content="Salary">
                  <button
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      salaryFunction(row._id);
                    }}
                  >
                    <p className="text-yellow-500 font-bold">$</p>
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </th>
      ))}
    </>
  );
}
