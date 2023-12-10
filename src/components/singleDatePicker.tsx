"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addDays } from "date-fns";

import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import { Calendar } from "../../@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

export function SingleDatePicker({
    label,
    buttonStyle,
}: {
    label?: string;
    buttonStyle?: string;
}) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    return (
        <div className="w-full bg-white">
            <p className="text-[#5B5F7B] block text-small font-medium pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                {label}
            </p>
            <Popover>
                <PopoverTrigger>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal border-2 rounded-lg w-full",
                            !date && "text-muted-foreground h-10",
                            buttonStyle && buttonStyle
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            <>{format(date, "LLL dd, y")} </>
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white">
                    <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
