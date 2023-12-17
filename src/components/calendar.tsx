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
    addDays,
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
import { useSession } from "next-auth/react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Holidays } from "src/types/holidaysType";
import axios from "axios";
import { useToast } from "../../@/components/ui/use-toast";
import { SingleDatePicker } from "./singleDatePicker";

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

const holidaySchema = yup.object({
    day: yup.date().required("Holiday date can not be blank"),
    name: yup
        .string()
        .required()
        .min(1, "Name of holiday must have minimum of 1 character")
        .max(100, "A name of holiday must have maximum of 100 character"),
});
const errorClassName =
    "h-2 text-[#ff2626] text-[10px] font-light self-start ml-4 italic";

const eventSchema = yup.object({
    dateTime: yup.string().required("A Event must have a date time"),
    name: yup
        .string()
        .required()
        .min(1, "Name of event must have minimum of 1 character")
        .max(50, "Name of event must have maximum of 50 characters"),
    room: yup
        .string()
        .required()
        .min(1, "Room must have minimum of 1 character")
        .max(50, "Room must have maximum of 50 characters"),
    description: yup
        .string()
        .required()
        .min(1, "Description must have minimum of 1 character")
        .max(500, "Description must have maximum of 500 characters"),
    users: yup
        .array()
        .of(yup.string())
        .min(1, "Event must have at least 1 user"),
    optionalUsers: yup.array().of(yup.string()),
    time: yup.date().required("Provide time please"),
});

function Calendar() {
    // declare
    const today = startOfToday();
    const eventOps = [
        { name: "Holiday", value: "holiday" },
        { name: "Meeting", value: "meeting" },
    ];
    const axiosPrivate = useAxiosPrivate();
    const { toast } = useToast();

    // useState
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    const [employees, setEmployees] = useState<Employee[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [values, setValues] = useState<Selection>();
    const [optValues, setOptValues] = useState<Selection>();
    const [selectedEmpId, setSelectedEmpId] = useState<string[]>([]);
    const [selectedOptEmpId, setSelectedOptEmpId] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("meeting");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [holidays, setHolidays] = useState<Holidays[]>([]);

    //var
    let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

    // modal props and method
    const { isOpen, onOpen, onClose } = useDisclosure();

    // session
    const { data: session } = useSession();
    const user = session?.user;

    // Header to render
    const TopContent = ({ selected }: { selected: string[] }) => {
        if (!selected.length) {
            return null;
        }

        return (
            <ScrollShadow
                hideScrollBar
                className="w-full flex py-0.5 px-2 gap-1"
                orientation="horizontal"
            >
                {employees &&
                    selected.map((value) => (
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

    // useEffect
    useEffect(() => {
        const getEvents = async () => {
            try {
                const res = await axiosPrivate.get<Event[]>(`/events`);
                setEvents(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        const getHolidays = async () => {
            try {
                const res = await axiosPrivate.get<Holidays[]>("/holidays");
                console.log(res.data);
                setHolidays(res.data);
            } catch (e) {
                console.log({ e });
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
        getHolidays();
        getDepartments();
        getEvents();
        getEmployees();
    }, []);

    let days = eachDayOfInterval({
        start: addDays(startOfWeek(firstDayCurrentMonth), 1),
        end:
            addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), 1).getDate() ==
            7
                ? addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), -6)
                : addDays(endOfWeek(endOfMonth(firstDayCurrentMonth)), 1),
    });

    // functions
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

    const selectedDayHoliday = holidays?.filter((e) =>
        isSameDay(parseISO(e.day), selectedDay)
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

    const hasHolidayDate = (date: Date) => {
        const hasHoliday = holidays?.find((h) => {
            const holidayDate = new Date(h.day);
            return (
                holidayDate.getDate() == date.getDate() &&
                holidayDate.getMonth() == date.getMonth() &&
                holidayDate.getFullYear() == date.getFullYear()
            );
        });
        if (!hasHoliday) return false;
        return true;
    };

    //form
    const holidayForm = useFormik({
        initialValues: {
            name: "",
            day: new Date(),
        },

        // Pass the Yup schema to validate the form
        validationSchema: holidaySchema,

        // Handle form submission
        onSubmit: async ({ day, name }) => {
            setIsLoading(true);

            try {
                let dayString = format(new Date(day), "dd/MM/yyyy");
                const res = await axiosPrivate.post<{
                    holiday: Holidays;
                    message: string;
                }>("/holiday", {
                    name: name,
                    day: dayString,
                });
                console.log({ res });
                setHolidays([...holidays, res.data.holiday]);
                toast({
                    title: `New holiday created`,
                    description: `Holiday ${res.data.holiday.name} on ${format(
                        new Date(res.data.holiday.day),
                        "dd/MM/yyyy"
                    )}`,
                });
            } catch (err) {
                console.log("err", err);
                if (axios.isAxiosError(err))
                    toast({
                        title: `Error`,
                        description: err.response?.data.message,
                    });
            } finally {
                setIsLoading(false);
            }
        },
    });
    const eventForm = useFormik({
        initialValues: {
            name: "",
            time: startOfToday(),
            dateTime: new Date(),
            room: "",
            description: "",
            users: [],
            optionalUsers: [],
        },

        // Pass the Yup schema to validate the form
        validationSchema: eventSchema,

        // Handle form submission
        onSubmit: async ({
            dateTime,
            name,
            room,
            description,
            users,
            optionalUsers,
            time,
        }) => {
            setIsLoading(true);
            dateTime.setHours(time.getHours());
            dateTime.setMinutes(time.getMinutes());
            let userArray: { user: string; mandatory: boolean }[] = [];
            users.map((id) =>
                userArray.push({
                    user: id,
                    mandatory: true,
                })
            );
            optionalUsers.map((id) =>
                userArray.push({
                    user: id,
                    mandatory: false,
                })
            );
            try {
                const res = await axiosPrivate.post<Event>("/event", {
                    name,
                    dateTime,
                    room,
                    description,
                    users: userArray,
                });
                console.log({ res });
                setEvents([...events, res.data]);
            } catch (err) {
                console.log("err", err);
                if (axios.isAxiosError(err))
                    toast({
                        title: `Error`,
                        description: err.response?.data.message,
                    });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-1 flex-col border bg-gray-50 border-blue-700 rounded-xl overflow-hidden ">
            <BlurModal
                hideCloseButton
                title={
                    <div className="w-full flex justify-between">
                        <p>Add Event</p>
                        <div className="flex gap-2">
                            <RegularButton
                                isLoading={isLoading}
                                label="Save"
                                callback={() => {
                                    selectedOption == "meeting"
                                        ? eventForm.handleSubmit()
                                        : holidayForm.handleSubmit();
                                }}
                            />
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
                    <div className="flex flex-row min-h-[300px] gap-3">
                        <div className="flex flex-1 flex-col">
                            <InputText
                                value={
                                    selectedOption == "meeting"
                                        ? eventForm.values.name
                                        : holidayForm.values.name
                                }
                                label={
                                    selectedOption == "meeting"
                                        ? "Event Name"
                                        : "Holiday name"
                                }
                                placeHolder={
                                    selectedOption == "meeting"
                                        ? "Eg. Annual meeting"
                                        : "Eg. Tet holiday"
                                }
                                id="room"
                                buttonStyle="w-80 border-2 rounded-md border-[#e8e8e8]"
                                onChange={(e) => {
                                    selectedOption == "meeting"
                                        ? eventForm.setFieldValue(
                                              "name",
                                              e.target.value
                                          )
                                        : holidayForm.setFieldValue(
                                              "name",
                                              e.target.value
                                          );
                                }}
                            />
                            {selectedOption == "meeting" &&
                                eventForm.errors.name &&
                                eventForm.touched.name && (
                                    <span className={errorClassName}>
                                        {eventForm.errors.name}
                                    </span>
                                )}
                            {selectedOption == "holiday" &&
                                holidayForm.errors.name &&
                                holidayForm.touched.name && (
                                    <span className={errorClassName}>
                                        {holidayForm.errors.name}
                                    </span>
                                )}
                            <div className=" w-80 h-10 p-0 mt-2 gap-2 flex flex-col">
                                <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                    Date & Time
                                </h5>
                                {selectedOption == "meeting" && (
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <div className="flex flex-col">
                                            <TimeField
                                                defaultValue={
                                                    eventForm.values.time
                                                }
                                                label={"Start"}
                                                onChange={(val) =>
                                                    eventForm.setFieldValue(
                                                        "time",
                                                        val
                                                    )
                                                }
                                                sx={{
                                                    width: "100%",
                                                    borderWidth: "0px",
                                                    "& .MuiInputLabel-root.Mui-focused":
                                                        { color: "#979797" }, //styles the label
                                                    "& .MuiOutlinedInput-root":
                                                        {
                                                            "&:hover > fieldset":
                                                                {},
                                                            height: "40px",
                                                            borderRadius: "6px",
                                                        },
                                                    "& .MuiOutlinedInput-notchedOutline":
                                                        {
                                                            border: "2px solid #E8E8E8",
                                                        },
                                                }}
                                            />
                                            {selectedOption == "meeting" &&
                                                eventForm.errors.time &&
                                                eventForm.touched.time && (
                                                    <span
                                                        className={
                                                            errorClassName
                                                        }
                                                    >
                                                        <>
                                                            {
                                                                eventForm.errors
                                                                    .dateTime
                                                            }
                                                        </>
                                                    </span>
                                                )}
                                        </div>
                                    </LocalizationProvider>
                                )}
                                <SingleDatePicker
                                    buttonStyle="h-10"
                                    date={
                                        selectedOption == "meeting"
                                            ? eventForm.values.dateTime
                                            : holidayForm.values.day
                                    }
                                    setDate={(date) => {
                                        selectedOption == "meeting"
                                            ? eventForm.setFieldValue(
                                                  "dateTime",
                                                  date
                                              )
                                            : holidayForm.setFieldValue(
                                                  "day",
                                                  date
                                              );
                                    }}
                                />
                                {selectedOption == "meeting" &&
                                    eventForm.errors.dateTime &&
                                    eventForm.touched.dateTime && (
                                        <span className={errorClassName}>
                                            <>{eventForm.errors.dateTime}</>
                                        </span>
                                    )}
                                {selectedOption == "holiday" &&
                                    holidayForm.errors.day &&
                                    holidayForm.touched.day && (
                                        <span className={errorClassName}>
                                            <>{holidayForm.errors.day}</>
                                        </span>
                                    )}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <CustomDropdown
                                label="Type"
                                placeholder="Choose type"
                                buttonStyle="w-80 bg-white"
                                additionalStyle="mt-2 rounded-md"
                                labelStyle="text-xs text-[#24243f] pb-2 font-semibold"
                                options={eventOps}
                                onSelect={(val) => setSelectedOption(val)}
                                value={selectedOption}
                            />
                            {selectedOption == "meeting" &&
                                eventForm.errors.name &&
                                eventForm.touched.name && (
                                    <span
                                        className={
                                            "text-white " + errorClassName
                                        }
                                    >
                                        {eventForm.errors.name}
                                    </span>
                                )}
                            {selectedOption == "holiday" &&
                                holidayForm.errors.name &&
                                holidayForm.touched.name && (
                                    <span
                                        className={
                                            "text-white " + errorClassName
                                        }
                                    >
                                        {holidayForm.errors.name}
                                    </span>
                                )}
                            {/* Mandatory */}
                            {selectedOption == "meeting" && (
                                <>
                                    <div className="w-full flex flex-col mt-2">
                                        <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                            Mandatory Participants
                                        </h5>
                                    </div>
                                    <Popover
                                        placement="bottom"
                                        classNames={{
                                            content: "max-w-xs w-80",
                                        }}
                                    >
                                        <PopoverTrigger>
                                            <Button className=" max-w-xs bg-white border-2 rounded-md flex justify-start pl-3 text-gray-400">
                                                {selectedEmpId.length ? (
                                                    <TopContent
                                                        selected={selectedEmpId}
                                                    />
                                                ) : (
                                                    "Choose mandatory participants"
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className=" w-80">
                                            {employees ? (
                                                <Listbox
                                                    disabledKeys={
                                                        eventForm.values
                                                            .optionalUsers
                                                    }
                                                    classNames={{
                                                        base: "max-w-xs",
                                                        list: "max-h-[200px] overflow-y-scroll",
                                                    }}
                                                    items={employees}
                                                    label="Assigned to"
                                                    selectionMode="multiple"
                                                    selectedKeys={values}
                                                    onSelectionChange={(
                                                        key
                                                    ) => {
                                                        setValues(key);
                                                        let selectedArray: Key[] =
                                                            [];
                                                        if (
                                                            key instanceof Set
                                                        ) {
                                                            selectedArray =
                                                                Array.from(key);
                                                        }
                                                        setSelectedEmpId(
                                                            selectedArray.map(
                                                                (key) =>
                                                                    key.toString()
                                                            )
                                                        );
                                                        eventForm.setFieldValue(
                                                            "users",
                                                            selectedArray.map(
                                                                (key) =>
                                                                    key.toString()
                                                            )
                                                        );
                                                    }}
                                                    variant="flat"
                                                >
                                                    {(item) => (
                                                        <ListboxItem
                                                            key={item._id}
                                                            textValue={
                                                                item.name
                                                            }
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                    src={
                                                                        item.avatarImage
                                                                    }
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-tiny text-default-400">
                                                                        {
                                                                            item.code
                                                                        }
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
                                    {selectedOption == "meeting" &&
                                        eventForm.errors.users &&
                                        eventForm.touched.users && (
                                            <span className={errorClassName}>
                                                {eventForm.errors.users}
                                            </span>
                                        )}
                                </>
                            )}
                            {selectedOption == "meeting" && (
                                <>
                                    <div className="w-full flex flex-col mt-2">
                                        <h5 className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                            Optional Participants
                                        </h5>
                                    </div>
                                    <Popover
                                        placement="bottom"
                                        classNames={{
                                            content: "max-w-xs w-80",
                                        }}
                                    >
                                        <PopoverTrigger>
                                            <Button className=" max-w-xs bg-white border-2 rounded-md flex justify-start pl-3 text-gray-400">
                                                {selectedOptEmpId.length ? (
                                                    <TopContent
                                                        selected={
                                                            selectedOptEmpId
                                                        }
                                                    />
                                                ) : (
                                                    "Choose optional participants"
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className=" w-80">
                                            {employees ? (
                                                <Listbox
                                                    disabledKeys={
                                                        eventForm.values.users
                                                    }
                                                    classNames={{
                                                        base: "max-w-xs",
                                                        list: "max-h-[200px] overflow-y-scroll",
                                                    }}
                                                    items={employees}
                                                    label="Assigned to"
                                                    selectionMode="multiple"
                                                    selectedKeys={optValues}
                                                    onSelectionChange={(
                                                        key
                                                    ) => {
                                                        setOptValues(key);
                                                        let selectedArray: Key[] =
                                                            [];
                                                        if (
                                                            key instanceof Set
                                                        ) {
                                                            selectedArray =
                                                                Array.from(key);
                                                        }
                                                        setSelectedOptEmpId(
                                                            selectedArray.map(
                                                                (key) =>
                                                                    key.toString()
                                                            )
                                                        );
                                                        eventForm.setFieldValue(
                                                            "optionalUsers",
                                                            selectedArray.map(
                                                                (key) =>
                                                                    key.toString()
                                                            )
                                                        );
                                                    }}
                                                    variant="flat"
                                                >
                                                    {(item) => (
                                                        <ListboxItem
                                                            key={item._id}
                                                            textValue={
                                                                item.name
                                                            }
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                    src={
                                                                        item.avatarImage
                                                                    }
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-tiny text-default-400">
                                                                        {
                                                                            item.code
                                                                        }
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
                                    {selectedOption == "meeting" &&
                                        eventForm.errors.optionalUsers &&
                                        eventForm.touched.optionalUsers && (
                                            <span className={errorClassName}>
                                                {eventForm.errors.optionalUsers}
                                            </span>
                                        )}
                                    {selectedOption == "meeting" && (
                                        <>
                                            <InputText
                                                label="Room"
                                                placeHolder="Choose room"
                                                id="room"
                                                buttonStyle="w-80 border-2 rounded-md border-[#e8e8e8]"
                                                onChange={(e) => {
                                                    eventForm.setFieldValue(
                                                        "room",
                                                        e.target.value
                                                    );
                                                }}
                                                value={eventForm.values.room}
                                            />
                                            {eventForm.errors.room &&
                                                eventForm.touched.room && (
                                                    <span
                                                        className={
                                                            errorClassName
                                                        }
                                                    >
                                                        {eventForm.errors.room}
                                                    </span>
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                            {selectedOption == "meeting" && (
                                <div className="w-full flex flex-col mt-2">
                                    <p className="text-xs mb-2 text-[#24243f] dark:text-[#FAF9F6] font-semibold">
                                        Description
                                    </p>
                                    <Textarea
                                        className="h-[100px] w-11/12"
                                        onChange={(e) =>
                                            eventForm.setFieldValue(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        value={eventForm.values.description}
                                    />
                                    {eventForm.errors.description &&
                                        eventForm.touched.description && (
                                            <span className={errorClassName}>
                                                {eventForm.errors.description}
                                            </span>
                                        )}
                                </div>
                            )}
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
                            {hasEventDate(selectedDay) ||
                            hasHolidayDate(selectedDay) ? (
                                <>
                                    <>
                                        {selectedDayEvent?.map((event) => (
                                            <div
                                                className="w-full "
                                                key={event._id}
                                            >
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
                                        ))}
                                    </>
                                    <>
                                        {selectedDayHoliday?.map((holiday) => (
                                            <div
                                                className="w-full "
                                                key={holiday._id}
                                            >
                                                <div className="border p-4 border-gray-400 border-solid rounded-xl mb-4 w-full">
                                                    <div className="flex justify-between">
                                                        <a
                                                            // tabindex="0"
                                                            className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2"
                                                        >
                                                            Holiday
                                                        </a>
                                                    </div>
                                                    <p className="text-sm pt-2 pl-2 leading-4 text-gray-600">
                                                        {holiday.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </>
                            ) : (
                                <p className="text-xs font-light leading-3 text-gray-500 mt-5">
                                    {"There is no event occur on " +
                                        format(selectedDay, "dd MMM")}
                                </p>
                            )}
                        </ScrollShadow>
                    </div>
                </div>
                <div className="lg:max-w-md flex w-full shadow-lg bg-white flex-col">
                    {(user?.roles.includes(process.env.HRManager) && (
                        <button
                            onClick={onOpen}
                            className="self-end mt-5 mr-6 transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 rounded-full"
                        >
                            <CalendarIcon />
                        </button>
                    )) ||
                        (user?.roles.includes(process.env.CEO) && (
                            <button
                                onClick={onOpen}
                                className="self-end mt-5 mr-6 transform transition-all ring-0 ring-gray-300 hover:ring-4 ring-opacity-30 duration-200 rounded-full"
                            >
                                <CalendarIcon />
                            </button>
                        ))}
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
                                                        hasHolidayDate(day) &&
                                                        "bg-[#593FA9] text-white"
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
