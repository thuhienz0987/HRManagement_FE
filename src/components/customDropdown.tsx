import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../../@/components/ui/scroll-area";

type Item = {
  name: string;
  value: string;
};

const CustomDropdown = ({
  label,
  placeholder,
  additionalStyle,
  buttonStyle,
  options = [],
  onSelect,
  onChange,
  value,
  labelStyle,
  name,
  disable = false,
}: {
  label?: string;
  placeholder?: string;
  additionalStyle?: string;
  buttonStyle?: string;
  options?: Array<Item>;
  onSelect: (value: string) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: string;
  labelStyle?: string;
  name?: string;
  disable?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(ref.current?.offsetWidth || 0);
  }, []);

  return (
    <div className={`flex flex-col ${additionalStyle} `}>
      {label && (
        <p
          className={`block text-small font-medium pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none  ${
            labelStyle ? labelStyle : "text-[#5B5F7B] dark:text-[#5B5F7B]"
          } `}
        >
          {label}
        </p>
      )}
      <Select
        aria-label="Dropdown"
        radius="sm"
        classNames={{
          trigger: `rounded-lg h-full text-foreground-500 text-button border-border border-2 ${buttonStyle}`,
        }}
        placeholder={placeholder}
        onChange={(e) => onSelect(e.target.value)}
        selectedKeys={value ? [value] : undefined}
        name={name}
        isDisabled={disable}
      >
        {options.map((item) => (
          <SelectItem
            className={"w-full bg-white dark:bg-[#3b3b3b50] "}
            key={item.value}
            value={item.value}
          >
            {item.name}
          </SelectItem>
        ))}
        {/* {animals.map((animal) => (
                    <SelectItem key={animal.value} value={animal.value}>
                        {animal.label}
                    </SelectItem>
                ))} */}
      </Select>
      {/* <Select
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
                placeholder={placeholder}
            >
                {(item) => (
                    <SelectItem
                        className={"w-full bg-white hover:bg-slate-100"}
                        key={item.value}
                        value={item.value}
                    >
                        {item.name}
                    </SelectItem>
                )}
            // </Select> */}
    </div>
  );
};

export default CustomDropdown;
