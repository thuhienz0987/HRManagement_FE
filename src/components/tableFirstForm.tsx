import { useEffect, useState } from "react";

export enum ColumnEnum {
    indexColumn,
    textColumn,
    filterColumn,
    functionColumn,
}
export interface ColumnType {
    title: string;
    type: ColumnEnum;
}

const TableFirstForm = ({ columns }: { columns: ColumnType[] }) => {
    const [checkedAll, setCheckedAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rows = [
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "1",
            Employee: "NV001",
            FullName: "Nguyen van A",
            RequestDay: "RequestDay",
            Department: "Account",
            Status: "pending",
        },
        {
            // No: "2",
            Employee: "NV001",
            FullName: "Nguyen van A",
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
        return columns.map((key) => (
            <th
                className={`${index % 2 ? "bg-[#E9EFF2]" : "bg-white"} ${
                    key.type == ColumnEnum.indexColumn && "flex-[0.5_1_0%]"
                } flex flex-row flex-1 gap-1 p-2 border-x-[1px] border-slate-300`}
            >
                {key.type == ColumnEnum.indexColumn && (
                    <>
                        <input
                            checked={checkedItem}
                            onClick={() => setCheckedItem(!checkedItem)}
                            type="checkbox"
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        {index + 1}
                    </>
                )}
                {row[key.title as keyof typeof row]}
            </th>
        ));
    };

    return (
        <div className="flex flex-col bg-white mx-[5%] w-full px-[14px] py-6 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg border-[rgba(18, 48, 96, 0.5)] border-2 my-2">
            <h3 className=" text-[26px] font-semibold text-[#005FD0]">
                Today absent requests
            </h3>
            <hr className="w-full h-[2px] bg-[#12306080] border-[1px] mt-4" />
            <table className="border-[rgba(194, 201, 250, 1)] border-[2px] mt-5 flex flex-col">
                {/* title row */}
                <tbody>
                    <tr className=" font-sans text-gray-600 text-xs h-12 bg-[#dde1e6] flex w-full">
                        {columns.map((column, index) => (
                            <th
                                className={`${
                                    column.type == ColumnEnum.indexColumn &&
                                    "flex-[0.5_1_0%]"
                                } border-x-[1px] flex flex-row flex-1 items-center gap-1 p-2 border-slate-300`}
                            >
                                {column.type == ColumnEnum.indexColumn && (
                                    <input
                                        checked={checkedAll}
                                        onClick={() =>
                                            setCheckedAll(!checkedAll)
                                        }
                                        type="checkbox"
                                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                )}
                                {column.title}
                            </th>
                        ))}
                    </tr>
                    {/* content row */}
                    {rows.map(
                        (row, index) =>
                            index >= currentPage - 1 &&
                            index <= currentPage - 1 + 4 && (
                                <tr className=" font-sans text-gray-600 text-xs h-12 flex w-full">
                                    {renderRow(row, index)}
                                </tr>
                            )
                    )}
                </tbody>
            </table>
            <div className="flex justify-between mt-3">
                <h5 className="text-[#0F1E5D] text-sm">
                    Have shown from
                    <span className="font-semibold">
                        {" "}
                        {(currentPage - 1) * 5 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                        {(currentPage - 1) * 5 + 5}{" "}
                    </span>
                    /<span className="font-semibold">{rows.length} </span>{" "}
                    records{" "}
                </h5>
                <div className=" gap-2 flex">
                    <PreviousPageButton />
                    <PageNumberButton />
                    <PageNumberButton />
                    <PageNumberButton />
                    <NextPageButton />
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
