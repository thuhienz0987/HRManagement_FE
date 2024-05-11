import { Checkbox, Pagination, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DeleteIcon, EditIcon, EyeIcon } from "src/svgs";
import { RenderRow } from "./renderRow";
import ButtonDropdown from "./buttonDropdown";
import { useTheme } from "next-themes";

export enum ColumnEnum {
  indexColumn,
  indexWithCheckBox,
  textColumn,
  filterColumn,
  functionColumn,
}
export interface ColumnType {
  title: string;
  type: ColumnEnum;
  key: string;
  filterOptions?: Array<any>;
  setFilterVal?: (value?: string) => void;
}

const TableFirstForm = ({
  columns,
  tableName,
  rows,
  viewFunction,
  editFunction,
  deleteFunction,
  salaryFunction,
}: {
  columns: ColumnType[];
  tableName?: string;
  rows?: Array<any>;
  viewFunction?: (id: string) => void;
  editFunction?: (id: string) => void;
  deleteFunction?: (id: string) => void;
  salaryFunction?: (id: string) => void;
}) => {
  const { theme } = useTheme();
  const [checkedAll, setCheckedAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const page = Math.ceil((rows && rows.length / 5) || 1);
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [rows]);

  return (
    <div className="flex flex-col bg-white dark:bg-dark w-full my-2">
      {tableName && (
        <h3 className=" text-[26px] font-semibold text-[#2C3D3A] dark:text-button">
          {tableName}
        </h3>
      )}
      <hr className="w-full h-[2px] bg-[#12306080] dark:bg-[#C89E3180] border-[1px] mt-4" />
      <table className="border-[#C89E3150] dark:border-button border-[2px] mt-5 flex flex-col max-lg:overflow-x-scroll">
        {/* title row */}
        <tbody>
          <tr className=" font-sans text-[#2C3D3A] dark:text-button text-xs h-12  flex w-full ">
            {columns.map((column, index) => (
              <th
                className={`${
                  column.type == ColumnEnum.indexWithCheckBox &&
                  "flex-[0.5_1_0%]"
                } ${
                  column.type == ColumnEnum.indexColumn && "flex-[0.5_1_0%]"
                } border-x-[1px] flex flex-row flex-1 items-center gap-1 p-2 dark:border-b-button dark:border-b-2 border-[#C89E3150] dark:border-button min-w-[110px] bg-[#dde1e6] dark:bg-[#040D1250]`}
              >
                {(() => {
                  switch (column.type) {
                    case ColumnEnum.indexWithCheckBox:
                      return (
                        <Checkbox
                          isSelected={checkedAll}
                          onClick={() => setCheckedAll(!checkedAll)}
                          size="sm"
                          color="default"
                          classNames={{
                            label: "text-xs text-gray-600",
                          }}
                        >
                          {column.title}
                        </Checkbox>
                      );
                    case ColumnEnum.filterColumn:
                      return (
                        <div className="flex w-full justify-between">
                          {column.title}
                          {column.filterOptions && (
                            <ButtonDropdown
                              options={column.filterOptions}
                              setSortedValue={column.setFilterVal}
                            />
                          )}
                        </div>
                      );
                    default:
                      return column.title;
                  }
                })()}
              </th>
            ))}
          </tr>
          {/* content row */}
          {rows?.map(
            (row, index) =>
              index >= (currentPage - 1) * 5 &&
              index <= (currentPage - 1) * 5 + 4 && (
                <tr className=" font-sans text-gray-600 dark:text-[#FAF9F6] text-xs h-12 flex w-full ">
                  <RenderRow
                    row={row}
                    index={index}
                    checkedAll={checkedAll}
                    columns={columns}
                    key={index}
                    viewFunction={viewFunction}
                    editFunction={editFunction}
                    deleteFunction={deleteFunction}
                    salaryFunction={salaryFunction}
                  />
                </tr>
              )
          )}
          {currentPage == page &&
            rows &&
            rows.length % 5 != 0 &&
            [...Array(5 - (rows.length % 5))].map((index) => (
              <tr className=" font-sans text-gray-600 dark:text-[#FAF9F6] text-xs h-12 flex w-full">
                <EmptyRow
                  sampleRow={rows[1]}
                  index={rows.length - 1 + index}
                  checkedAll={checkedAll}
                  columns={columns}
                  key={index}
                />
              </tr>
            ))}
          {rows?.length == 0 && (
            <tr className=" font-sans text-gray-600  dark:text-button text-xs h-12 flex w-full">
              <p>There is no data yet for this table</p>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-3">
        <h5 className="text-[#0F1E5D] dark:text-button text-sm">
          Displayed
          <span className="font-semibold">
            {" "}
            {rows?.length ? (currentPage - 1) * 5 + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {currentPage == page ? rows?.length : (currentPage - 1) * 5 + 5}{" "}
          </span>
          /<span className="font-semibold">{rows?.length} </span> records{" "}
        </h5>
        <div className=" gap-2 flex">
          <Pagination
            showControls
            size="sm"
            total={page}
            initialPage={1}
            onChange={(page) => setCurrentPage(page)}
            color={"default"}
          />
        </div>
      </div>
    </div>
  );
};

const EmptyRow = ({
  sampleRow,
  index,
  checkedAll,
  columns,
}: {
  sampleRow: any;
  index: number;
  checkedAll: boolean;
  columns: ColumnType[];
}) => {
  const [checkedItem, setCheckedItem] = useState(false);
  useEffect(() => {
    setCheckedItem(checkedAll);
  }, [checkedAll]);
  return columns.map((column) => (
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
      {"  "}
    </th>
  ));
};

export default TableFirstForm;
