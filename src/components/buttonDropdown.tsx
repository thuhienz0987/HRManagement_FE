import React, { Key, useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Listbox,
    ListboxItem,
    Selection,
} from "@nextui-org/react";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { ArrowIcon } from "src/svgs";
import { options } from "src/app/api/auth/[...nextauth]/option";

export default function ButtonDropdown({
    options,
    setSortedValue,
}: {
    options: Array<any>;
    setSortedValue?: (value?: string) => void;
}) {
    const [selected, setSelected] = useState<Selection>();
    // const onSelectionChange = (key: Selection) => {
    //     setSelected(key);
    // };
    // const [selectedValue, setSelectedValue]
    return (
        <Popover placement="bottom" showArrow={true}>
            <PopoverTrigger>
                <Button className=" min-w-[16px] w-[16px] p-1 h-4 rounded-sm rotate-90">
                    <ArrowIcon width="12" height="12" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-1">
                <Listbox
                    aria-label="Actions"
                    onSelectionChange={(key) => {
                        setSelected(key);
                        let selectedArray: Key[] = [];
                        if (key instanceof Set) {
                            selectedArray = Array.from(key);
                        }
                        if (selectedArray.length == 0)
                            return setSortedValue && setSortedValue(undefined);
                        setSortedValue &&
                            setSortedValue(
                                selectedArray[0]?.toString() || undefined
                            );
                        console.log(selectedArray[0]?.toString() || undefined);
                    }}
                    selectedKeys={selected}
                    selectionMode="single"
                >
                    {options.map((item) => (
                        <ListboxItem key={item.value}>{item.name}</ListboxItem>
                    ))}
                </Listbox>
            </PopoverContent>
        </Popover>
    );
}
