"use client";
import TableFirstForm, {
    ColumnEnum,
    ColumnType,
} from "src/components/tableFirstForm";

const Absent = () => {
    const columns: ColumnType[] = [
        {
            title: "No",
            type: ColumnEnum.indexColumn,
        },
        {
            title: "Employee",
            type: ColumnEnum.textColumn,
        },
        {
            title: "FullName",
            type: ColumnEnum.textColumn,
        },
        {
            title: "RequestDay",
            type: ColumnEnum.textColumn,
        },
        {
            title: "Department",
            type: ColumnEnum.textColumn,
        },
        {
            title: "Status",
            type: ColumnEnum.textColumn,
        },
    ];
    return (
        <div className="flex">
            <TableFirstForm columns={columns} />
        </div>
    );
};

export default Absent;
