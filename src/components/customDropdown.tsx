import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "../../@/components/ui/select";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollArea } from "../../@/components/ui/scroll-area";

const CustomDropdown = ({
    label,
    placeholder,
    additionalStyle,
}: {
    label: string;
    placeholder: string;
    additionalStyle?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const childRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);
    useEffect(() => {
        setWidth(ref.current?.offsetWidth || 0);
    }, []);

    return (
        <div className={`flex flex-col ${additionalStyle}`}>
            <p className="text-[#5B5F7B] block text-small font-medium pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                {label}
            </p>
            <Select className="w-full ">
                <SelectTrigger className="rounded-lg h-full text-foreground-500 border-border border-2">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <div ref={ref} className="w-full">
                    <SelectContent
                        className={"bg-white border-white h-[250px]"}
                        style={{ width: width }}
                    >
                        {[...Array(15)].map((item) => (
                            <SelectItem
                                className={"w-full bg-white hover:bg-slate-100"}
                                value="m@example.com"
                            >
                                m@example.com
                            </SelectItem>
                        ))}
                        <SelectItem
                            className={"w-full bg-white"}
                            value="m@google.com"
                        >
                            m@google.com
                        </SelectItem>
                        <SelectItem
                            className={"w-full bg-white"}
                            value="m@support.com"
                        >
                            m@support.com
                        </SelectItem>
                    </SelectContent>
                </div>
            </Select>
            {/* <Dropdown className="w-full">
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                        className="rounded-lg justify-start text-foreground-500 border-border"
                    >
                        {placeholder}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Static Actions"
                    className="relative w-full "
                >
                    <DropdownItem key="new" className="w-full">
                        New file
                    </DropdownItem>
                    <DropdownItem key="copy" className=" w-full">
                        Copy link
                    </DropdownItem>
                    <DropdownItem key="edit">Edit file</DropdownItem>
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                    >
                        Delete file
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown> */}
        </div>
    );
};

export default CustomDropdown;
