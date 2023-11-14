"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import { Calendar } from "../../@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../@/components/ui/popover";

export function DatePicker({
    label,
    buttonStyle,
}: {
    label?: string;
    buttonStyle?: string;
}) {
    const [date, setDate] = React.useState<Date>();

    return (
        <div className="w-full">
            <p className="text-[#5B5F7B] block text-small font-medium pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                {label}
            </p>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal border-2 rounded-lg w-full",
                            !date && "text-muted-foreground h-10",
                            buttonStyle && buttonStyle
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
