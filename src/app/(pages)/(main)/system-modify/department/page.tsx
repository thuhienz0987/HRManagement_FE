"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";
import { Department } from "src/types/userType";

type dDepartment = Department & {
    manager: string;
};

const Department = () => {
    const router = useRouter();
    const axiosPrivate = useAxiosPrivate();
    const [departments, setDepartments] = useState<dDepartment[]>();

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
    const editDepartment = () => {
        return router.replace("/system-modify/department-details");
    };
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4 rounded gap-y-9">
            <div className="flex flex-1 flex-col w-full items-center rounded ">
                <div className="flex flex-1 flex-col bg-white w-full min-h-unit-3 items-start py-16 gap-2 shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg ">
                    <div className=" flex w-full px-16 gap-x-3 items-end justify-between">
                        <div className="text-[#2C3D3A] block text-3xl font-semibold">
                            Department Management
                        </div>                       
                    </div>
                    <div className="w-[95%] self-center flex">
                        <TableFirstForm columns={columns} rows={departments} 
                            editFunction={editDepartment}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Department;
