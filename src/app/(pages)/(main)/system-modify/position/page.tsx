"use client";
import { useEffect, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { Position } from "src/types/userType";


const Position = () => {
    const axiosPrivate = useAxiosPrivate();
    const [positions, setPositions] = useState<Position[]>();

    useEffect(() => {
        const getPositions = async () => {
            try {
                const res = await axiosPrivate.get<Position[]>(
                    "/positions"
                );
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
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Position Management
                        </div>                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={positions}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Position;
