import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addDays, isBefore } from "date-fns";
import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import { Calendar } from "../../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../@/components/ui/popover";
import { DateRange } from "react-day-picker";

export function FormikDatePicker({
  label,
  buttonStyle,
  selected,
  onChange,
}: {
  label?: string;
  buttonStyle?: string;
  selected: DateRange | undefined;
  onChange: (date: DateRange) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(selected);

  const handleDateChange = (newDate: DateRange) => {
    // Validate the selected date range
    if (newDate && newDate.from && isBefore(newDate.from, new Date())) {
      // If the selected date is before the current date, set it to the current date
      const correctedDate = {
        ...newDate,
        from: new Date(),
      };
      setDate(correctedDate);
      onChange(correctedDate);
    } else {
      setDate(newDate);
      onChange(newDate);
    }
  };

  return (
    <div className="w-full bg-white">
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate: DateRange | undefined) =>
              handleDateChange(newDate!)
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
