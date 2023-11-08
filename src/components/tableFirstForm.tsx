import { Checkbox, Pagination, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, EyeIcon } from "src/svgs";

export enum ColumnEnum {
    indexColumn,
    textColumn,
    filterColumn,
    functionColumn,
}
export interface ColumnType {
    title: string;
    type: ColumnEnum;
    key: string;
}

const TableFirstForm = ({
    columns,
    tableName,
    viewFunction,
    editFunction,
    deleteFunction,
}: {
    columns: ColumnType[];
    tableName?: string;
    viewFunction?: () => void;
    editFunction?: () => void;
    deleteFunction?: () => void;
}) => {
    const [checkedAll, setCheckedAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rows = [
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            requestDay: "RequestDay",
            department: "Account",
            status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            requestDay: "RequestDay",
            department: "Account",
            status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            employeeCode: "NV001",
            fullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
    ];
    const page = Math.ceil(rows.length / 5);

    const renderRow = (row: any, index: number) => {
        const [checkedItem, setCheckedItem] = useState(false);
        useEffect(() => {
            setCheckedItem(checkedAll);
        }, [checkedAll]);
        return columns.map((column) => (
            <th
                className={`${index % 2 ? "bg-[#E9EFF2]" : "bg-white"} ${
                    column.type == ColumnEnum.indexColumn && "flex-[0.5_1_0%]"
                } flex flex-row flex-1 gap-1 p-2 border-x-[1px] border-slate-300 items-center text-[#2C3D3A] font-normal text-xs`}
            >
                {column.type == ColumnEnum.indexColumn && (
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
                {column.type == ColumnEnum.textColumn &&
                    row[column.key as keyof typeof row]}
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
        ));
    };

    const emptyRow = (sampleRow: any, index: number) => {
        const [checkedItem, setCheckedItem] = useState(false);
        useEffect(() => {
            setCheckedItem(checkedAll);
        }, [checkedAll]);
        return columns.map((column) => (
            <th
                className={`${index % 2 ? "bg-[#E9EFF2]" : "bg-white"} ${
                    column.type == ColumnEnum.indexColumn && "flex-[0.5_1_0%]"
                } flex flex-row flex-1 gap-1 p-2 border-x-[1px] border-slate-300 items-center text-[#2C3D3A] font-normal text-xs`}
            >
                {/* {column.type == ColumnEnum.indexColumn && (
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
                )} */}
                {"  "}
            </th>
        ));
    };

    return (
        <div className="flex flex-col bg-white w-full my-2">
            {tableName && (
                <h3 className=" text-[26px] font-semibold text-[#2C3D3A]">
                    {tableName}
                </h3>
            )}
            <hr className="w-full h-[2px] bg-[#12306080] border-[1px] mt-4" />
            <table className="border-[rgba(194, 201, 250, 1)] border-[2px] mt-5 flex flex-col">
                {/* title row */}
                <tbody>
                    <tr className=" font-sans text-[#2C3D3A] text-xs h-12 bg-[#dde1e6] flex w-full">
                        {columns.map((column, index) => (
                            <th
                                className={`${
                                    column.type == ColumnEnum.indexColumn &&
                                    "flex-[0.5_1_0%]"
                                } border-x-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300`}
                            >
                                {column.type == ColumnEnum.indexColumn && (
                                    <Checkbox
                                        isSelected={checkedAll}
                                        onClick={() =>
                                            setCheckedAll(!checkedAll)
                                        }
                                        size="sm"
                                        color="default"
                                        classNames={{
                                            label: "text-xs text-gray-600",
                                        }}
                                    >
                                        {column.title}
                                    </Checkbox>
                                )}
                                {column.type !== ColumnEnum.indexColumn &&
                                    column.title}
                            </th>
                        ))}
                    </tr>
                    {/* content row */}
                    {rows.map(
                        (row, index) =>
                            index >= (currentPage - 1) * 5 &&
                            index <= (currentPage - 1) * 5 + 4 && (
                                <tr className=" font-sans text-gray-600 text-xs h-12 flex w-full">
                                    {renderRow(row, index)}
                                </tr>
                            )
                    )}
                    {currentPage == page &&
                        [...Array(5 - (rows.length % 5))].map((index) => (
                            <tr className=" font-sans text-gray-600 text-xs h-12 flex w-full">
                                {emptyRow(rows[1], rows.length - 1 + index)}
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-3">
                <h5 className="text-[#0F1E5D] text-sm">
                    Displayed
                    <span className="font-semibold">
                        {" "}
                        {(currentPage - 1) * 5 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                        {currentPage == page
                            ? rows.length
                            : (currentPage - 1) * 5 + 5}{" "}
                    </span>
                    /<span className="font-semibold">{rows.length} </span>{" "}
                    records{" "}
                </h5>
                <div className=" gap-2 flex">
                    <Pagination
                        showControls
                        size="sm"
                        total={page}
                        initialPage={1}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
};

const PreviousPageButton = () => {
    {
        return (
            <button>
                <div
                    className={
                        "relative flex overflow-hidden items-center justify-center rounded w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md group-ring-3 border border-[#005FD0]"
                    }
                >
                    <div
                        className={
                            "flex flex-col justify-between w-[12px] h-[12px] origin-center overflow-hidden rotate-180 -translate-x-1 self-center"
                        }
                    >
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] origin-left rotate-[42deg] w-2/3"
                            }
                        ></div>
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] w-5 translate-x-10"
                            }
                        ></div>
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] origin-left w-2/3 -rotate-[42deg]"
                            }
                        ></div>
                    </div>
                </div>
            </button>
        );
    }
};

const PageNumberButton = () => {
    {
        return (
            <button
                className={
                    "relative flex overflow-hidden items-center justify-center rounded w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md group-ring-3 border border-[#005FD0]"
                }
            >
                <div className={"text-[#005FD0] text-sm font-medium"}>1</div>
            </button>
        );
    }
};

const NextPageButton = () => {
    {
        return (
            <button>
                <div
                    className={
                        "relative flex overflow-hidden items-center justify-center rounded w-[30px] h-[30px] transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 shadow-md group-ring-3 border border-[#005FD0]"
                    }
                >
                    <div
                        className={
                            "flex flex-col justify-between w-[12px] h-[12px] origin-center overflow-hidden translate-x-1 self-center"
                        }
                    >
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] origin-left rotate-[42deg] w-2/3"
                            }
                        ></div>
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] w-5 translate-x-10"
                            }
                        ></div>
                        <div
                            className={
                                "bg-[#005FD0] h-[2px] origin-left w-2/3 -rotate-[42deg]"
                            }
                        ></div>
                    </div>
                </div>
            </button>
        );
    }
};
export default TableFirstForm;
