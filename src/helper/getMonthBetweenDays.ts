import { add, format } from "date-fns";

export default function getMonthsBetweenDates(startDay: Date, endDay: Date) {
    let months = [];
    let date: Date = startDay;
    while (date <= endDay) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        months.push({
            name: format(date, "MMM yyyy"),
            value: "/" + month + "/" + year,
        });

        date = add(date, { months: 1 });
    }

    return months;
}
