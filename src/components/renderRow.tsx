import { useEffect, useState } from "react";
import { ColumnEnum, ColumnType } from "./tableFirstForm";
import { Checkbox, Tooltip } from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "src/svgs";

export function RenderRow({
    row,
    index,
    checkedAll,
    columns,
}: {
    row: any;
    index: number;
    checkedAll: boolean;
    columns: ColumnType[];
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
                    className={`${index % 2 ? "bg-[#E9EFF2]" : "bg-white"} ${
                        column.type == ColumnEnum.indexColumn &&
                        "flex-[0.5_1_0%]"
                    } ${
                        column.type == ColumnEnum.indexWithCheckBox &&
                        "flex-[0.5_1_0%]"
                    } flex flex-row flex-1 gap-1 p-2 border-x-[1px] border-slate-300 items-center text-[#2C3D3A] font-normal text-xs`}
                >
                    {column.type == ColumnEnum.indexColumn && (
                        <p className="text-xs text-gray-600">{index + 1}</p>
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
                        <p className=" text-left">
                            {row[column.key as keyof typeof row]}
                        </p>
                    )}
                    {column.type == ColumnEnum.functionColumn && (
                        <div className="relative flex items-center gap-2">
                            <Tooltip content="Details">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon width="16" height="16" />
                                </span>
                            </Tooltip>
                            <Tooltip content="Edit user">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EditIcon width="16" height="16" />
                                </span>
                            </Tooltip>
                            <Tooltip color="danger" content="Delete user">
                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <DeleteIcon width="16" height="16" />
                                </span>
                            </Tooltip>
                        </div>
                    )}
                </th>
            ))}
        </>
    );
}
