import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isEqual,
    isSameDay,
    parse,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfToday,
    startOfWeek,
    add,
    isToday,
    isSameMonth,
} from "date-fns";
import { Key, useEffect, useMemo, useState } from "react";
import { CalendarIcon } from "src/svgs";
import {
    Avatar,
    Button,
    Chip,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollShadow,
    Selection,
    useDisclosure,
} from "@nextui-org/react";
import BlurModal from "./modal";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import { Department } from "src/types/userType";
import { User } from "next-auth";
import InputText from "./inputText";
import { Textarea } from "../../@/components/ui/textarea";
import CustomDropdown from "./customDropdown";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
    DatePickerProps,
    LocalizationProvider,
    TimeField,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "./datePicker";
import RegularButton from "./regularButton";
import { Event } from "src/types/eventType";

const meetings = [
    {
        id: 1,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-11T13:00",
        endDatetime: "2022-05-11T14:30",
    },
    {
        id: 2,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T09:00",
        endDatetime: "2022-05-20T11:30",
    },
    {
        id: 3,
        name: "Dries Vincent",
        imageUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-20T17:00",
        endDatetime: "2022-05-20T18:30",
    },
    {
        id: 4,
        name: "Leslie Alexander",
        imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-06-09T13:00",
        endDatetime: "2022-06-09T14:30",
    },
    {
        id: 5,
        name: "Michael Foster",
        imageUrl:
            "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        startDatetime: "2022-05-13T14:00",
        endDatetime: "2022-05-13T14:30",
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type dDepartment = Department & {
    _id: string;
};

type Employee = User;

function Calendar() {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    const [employees, setEmployees] = useState<Employee[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [values, setValues] = useState<Selection>();
    const [selectedEmpId, setSelectedEmpId] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>();

    // const arrayValues = Array.from(values);

    const TopContent = () => {
        if (!selectedEmpId.length) {
            return null;
        }

        return (
            <ScrollShadow
                hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {employees &&
                    selectedEmpId.map((value) => (
                        <Chip key={value}>
                            {
                                employees.find(
                                    (emp) => `${emp._id}` === `${value}`
                                )?.name
                            }
                        </Chip>
                    ))}
            </ScrollShadow>
        );
    };
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getEvents = async () => {
            // setLoading(true);
            try {
                const res = await axiosPrivate.get<Event[]>(`/events`);
                setEvents(res.data);
            } catch (e) {
                console.log({ e });
            } finally {
                // setLoading(false);
            }
        };
        const getEmployees = async () => {
            try {
                const res = await axiosPrivate.get<Employee[]>("/all-user", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                setEmployees(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getDepartments = async () => {
            try {
                const res = await axiosPrivate.get<dDepartment[]>(
                    "/departments"
                );
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getEvents();
        getEmployees();
    }, []);

    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

    let days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    });

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    }

    const selectedDayEvent = events?.filter((e) =>
        isSameDay(parseISO(e.dateTime), selectedDay)
    );

    const dateFromString = (dateString: string) => {
        const date = new Date(dateString);
        return date;
    };

    const hasEventDate = (date: Date) => {
        const hasEvent = events?.find((e) => {
            const eventDate = new Date(e.dateTime);
            return (
                eventDate.getDate() == date.getDate() &&
                eventDate.getMonth() == date.getMonth() &&
                eventDate.getFullYear() == date.getFullYear()
            );
        });
        if (!hasEvent) return false;
        return true;
    };
    return (
        <div className="flex flex-1 flex-col border bg-gray-50 border-blue-700 rounded-xl overflow-hidden ">
            <BlurModal
                hideCloseButton
                title={
                    <div className="w-full flex justify-between">
                        <p>Add Event</p>
                        <div className="flex gap-2">
                            <RegularButton label="Save" callback={() => {}} />
                            <RegularButton
                                additionalStyle="bg-bar"
                                label="Close"
                                callback={onClose}
                            />
                        </div>
                    </div>
                }
                size="4xl"
                body={
                    <div className="flex flex-row overflow-auto gap-3">
                        <div className="flex flex-1 flex-col">
                            <div className="w-full flex flex-col mt-2">
                                <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                    Participants
                                </h5>
                            </div>
                            <Popover
                                placement="bottom"
                                classNames={{ content: "max-w-xs w-80" }}
                            >
                                <PopoverTrigger>
                                    <Button className=" max-w-xs bg-white border-2 rounded-md flex justify-start pl-3 text-gray-400">
                                        {selectedEmpId.length ? (
                                            <TopContent />
                                        ) : (
                                            "Choose participants"
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className=" w-80">
                                    {employees ? (
                                        <Listbox
                                            // topContent={topContent}
                                            classNames={{
                                                base: "max-w-xs",
                                                list: "max-h-[200px] overflow-y-scroll",
                                            }}
                                            items={employees}
                                            label="Assigned to"
                                            selectionMode="multiple"
                                            selectedKeys={values}
                                            onSelectionChange={(key) => {
                                                setValues(key);
                                                let selectedArray: Key[] = [];
                                                if (key instanceof Set) {
                                                    selectedArray =
                                                        Array.from(key);
                                                }
                                                setSelectedEmpId(
                                                    selectedArray.map((key) =>
                                                        key.toString()
                                                    )
                                                );
                                            }}
                                            variant="flat"
                                        >
                                            {(item) => (
                                                <ListboxItem
                                                    key={item._id}
                                                    textValue={item.name}
                                                >
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar
                                                            alt={item.name}
                                                            className="flex-shrink-0"
                                                            size="sm"
                                                            src={
                                                                item.avatarImage
                                                            }
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-small">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-tiny text-default-400">
                                                                {item.code}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </ListboxItem>
                                            )}
                                        </Listbox>
                                    ) : (
                                        "Loading..."
                                    )}
                                </PopoverContent>
                            </Popover>
                            <InputText
                                label="Room"
                                placeHolder="Choose room"
                                id="room"
                                buttonStyle="w-80 border-2 rounded-md border-[#e8e8e8]"
                            />
                            <div className="w-full flex flex-col mt-2">
                                <p className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                    Description
                                </p>
                                <Textarea className="h-[100px] w-11/12" />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <CustomDropdown
                                label="Type"
                                placeholder="Choose type"
                                buttonStyle="w-80 bg-white"
                                additionalStyle="mt-2 rounded-md"
                                labelStyle="text-xs text-[#24243f] pb-2 font-semibold"
                            />
                            <InputText
                                label="Event Name"
                                placeHolder="Choose room"
                                id="room"
                                buttonStyle="w-80 border-2 rounded-md border-[#e8e8e8]"
                            />
                            <div className=" w-80 h-10 p-0 mt-2 gap-2 flex flex-col">
                                <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                    Date & Time
                                </h5>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                >
                                    <div className="flex gap-2">
                                        <TimeField
                                            defaultValue={today}
                                            label={"Start"}
                                            sx={{
                                                width: "100%",
                                                borderWidth: "0px",
                                                "& .MuiInputLabel-root.Mui-focused":
                                                    { color: "#979797" }, //styles the label
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover > fieldset": {},
                                                    height: "40px",
                                                    borderRadius: "6px",
                                                },
                                                "& .MuiOutlinedInput-notchedOutline":
                                                    {
                                                        border: "2px solid #E8E8E8",
                                                    },
                                            }}
                                        />
                                        <TimeField
                                            defaultValue={today}
                                            label={"End"}
                                            sx={{
                                                width: "100%",
                                                borderWidth: "0px",
                                                "& .MuiInputLabel-root.Mui-focused":
                                                    { color: "#979797" }, //styles the label
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover > fieldset": {},
                                                    height: "40px",
                                                    borderRadius: "6px",
                                                },
                                                "& .MuiOutlinedInput-notchedOutline":
                                                    {
                                                        border: "2px solid #E8E8E8",
                                                    },
                                            }}
                                        />
                                    </div>
                                </LocalizationProvider>
                                <DatePicker buttonStyle="h-10" />
                            </div>
                        </div>
                    </div>
                }
                isOpen={isOpen}
                onClose={onClose}
                footerButton={false}
            />
            {/* <div className="flex w-full justify-between h-fit px-10  pt-7"></div> */}
            <div className="flex flex-1 justify-center items-stretch">
                <div className="flex flex-1 flex-col px-2 lg:px-9 bg-gray-50 rounded-l items-center border justify-center relative">
                    <p className=" self-start top-5 block absolute text-xl font-medium">
                        Events
                    </p>
                    <div className=" px-0 lg:px-4 justify-self-center self-center w-full">
                        <ScrollShadow
                            size={30}
                            className="lg:h-[350px] h-[270px] w-full"
                            hideScrollBar
                        >
                            {hasEventDate(selectedDay) ? (
                                selectedDayEvent?.map((event) => (
                                    <div className="w-full " key={event._id}>
                                        <div className="border p-4 border-gray-400 border-solid rounded-xl mb-4 w-full">
                                            <div className="flex justify-between">
                                                <a
                                                    // tabindex="0"
                                                    className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2"
                                                >
                                                    {event.name}
                                                </a>
                                                <p className="text-right text-xs font-light leading-3 text-gray-500">
                                                    {format(
                                                        parseISO(
                                                            event.dateTime
                                                        ),
                                                        "h:mm aa"
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-sm pt-2 pl-2 leading-4 text-gray-600">
                                                {event.description}
                                            </p>
                                            <p className="text-sm pt-2 pl-2 leading-4 text-gray-600">
                                                {event.room}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs font-light leading-3 text-gray-500">
                                    {"There is no event occur on " +
                                        format(selectedDay, "dd MMM")}
                                </p>
                            )}
                        </ScrollShadow>
                    </div>
                </div>
                <div className="lg:max-w-md flex w-full shadow-lg bg-white flex-col">
                    <button
                        onClick={onOpen}
                        className="self-end mt-5 mr-6 transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 rounded-full"
                    >
                        <CalendarIcon />
                    </button>
                    <div className=" p-5 bg-white rounded-r">
                        <div className="px-4 flex items-center justify-between">
                            <span
                                // tabindex="0"
                                className="focus:outline-none  text-base font-bold text-gray-800"
                            >
                                {format(firstDayCurrentMonth, "MMM yyyy")}
                            </span>
                            <div className="flex items-center">
                                <button
                                    onClick={previousMonth}
                                    aria-label="calendar backward"
                                    className="focus:text-gray-400 hover:text-gray-400 text-gray-800"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-left"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <polyline points="15 6 9 12 15 18" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextMonth}
                                    aria-label="calendar forward"
                                    className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler  icon-tabler-chevron-right"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <polyline points="9 6 15 12 9 18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-12 overflow-x-auto flex-col">
                            <div className="grid grid-cols-7 lg:pt-6 w-full">
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Mo
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Tu
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        We
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Th
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Fr
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Sa
                                    </p>
                                </div>
                                <div className="w-full flex justify-center">
                                    <p className="text-base font-medium text-center text-gray-800">
                                        Su
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 lg:pt-6 w-full">
                                {days.map((day) => (
                                    <div className="px-2 py-1 lg:py-2 cursor-pointer flex w-full justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDay(day)}
                                            className={`
                                                ${
                                                    isEqual(day, selectedDay) &&
                                                    "text-white"
                                                }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        isToday(day) &&
                                                        "text-red-500"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        isSameMonth(
                                                            day,
                                                            firstDayCurrentMonth
                                                        ) &&
                                                        "text-gray-900"
                                                    }
                                                    ${
                                                        hasEventDate(day) &&
                                                        "bg-yellow-400"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        !isSameMonth(
                                                            day,
                                                            firstDayCurrentMonth
                                                        ) &&
                                                        "text-gray-400"
                                                    }
                                                    ${
                                                        isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        isToday(day) &&
                                                        "bg-red-500"
                                                    }
                                                    ${
                                                        isEqual(
                                                            day,
                                                            selectedDay
                                                        ) &&
                                                        !isToday(day) &&
                                                        "bg-gray-900"
                                                    }
                                                    ${
                                                        !isEqual(
                                                            day,
                                                            selectedDay
                                                        ) && "hover:bg-gray-200"
                                                    }
                                                    ${
                                                        ((isEqual(
                                                            day,
                                                            selectedDay
                                                        ) ||
                                                            isToday(day)) &&
                                                            "font-semibold",
                                                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full")
                                                    }
                                            `}
                                        >
                                            <time
                                                dateTime={format(
                                                    day,
                                                    "yyyy-MM-dd"
                                                )}
                                            >
                                                {format(day, "d")}
                                            </time>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;
