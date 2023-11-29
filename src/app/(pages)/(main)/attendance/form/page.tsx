"use client";
import {
    Avatar,
    Input,
    Listbox,
    ListboxItem,
    Selection,
    useDisclosure,
} from "@nextui-org/react";
import { Key, useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "src/app/api/useAxiosPrivate";
import CustomDropdown from "src/components/customDropdown";
import BlurModal from "src/components/modal";
import RegularButton from "src/components/regularButton";
import { SearchIcon } from "src/svgs";
import { Department, User } from "src/types/userType";
import { useToast } from "../../../../../../@/components/ui/use-toast";
import { Toaster } from "../../../../../../@/components/ui/toaster";
import { Attendance } from "src/types/attendanceType";
import { format, parseISO } from "date-fns";
import axios, { AxiosError } from "axios";

type Employee = User & {
    createdAt: string;
    department?: string;
};

type dDepartment = Department & {
    value: string;
};

type CheckInResponse = {
    attendance: Attendance;
    message: string;
};

const AttendanceForm = () => {
    const [employees, setEmployees] = useState<Employee[]>();
    const [departments, setDepartments] = useState<dDepartment[]>();
    const [sortedDept, setSortedDept] = useState<string>();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [selectedEmpId, setSelectedEmpId] = useState<string>();

    const { toast } = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const axiosPrivate = useAxiosPrivate();

    console.log(selectedEmpId);

    const [values, setValues] = useState<Selection>();
    //     {
    //         id: 1,
    //         name: "Tony Reichert",
    //         role: "CEO",
    //         team: "Management",
    //         status: "active",
    //         age: "29",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    //         email: "tony.reichert@example.com",
    //     },
    //     {
    //         id: 2,
    //         name: "Zoey Lang",
    //         role: "Tech Lead",
    //         team: "Development",
    //         status: "paused",
    //         age: "25",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    //         email: "zoey.lang@example.com",
    //     },
    //     {
    //         id: 3,
    //         name: "Jane Fisher",
    //         role: "Sr. Dev",
    //         team: "Development",
    //         status: "active",
    //         age: "22",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
    //         email: "jane.fisher@example.com",
    //     },
    //     {
    //         id: 4,
    //         name: "William Howard",
    //         role: "C.M.",
    //         team: "Marketing",
    //         status: "vacation",
    //         age: "28",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
    //         email: "william.howard@example.com",
    //     },
    //     {
    //         id: 5,
    //         name: "Kristen Copper",
    //         role: "S. Manager",
    //         team: "Sales",
    //         status: "active",
    //         age: "24",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
    //         email: "kristen.cooper@example.com",
    //     },
    //     {
    //         id: 6,
    //         name: "Brian Kim",
    //         role: "P. Manager",
    //         team: "Management",
    //         age: "29",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
    //         email: "brian.kim@example.com",
    //         status: "Active",
    //     },
    //     {
    //         id: 7,
    //         name: "Michael Hunt",
    //         role: "Designer",
    //         team: "Design",
    //         status: "paused",
    //         age: "27",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
    //         email: "michael.hunt@example.com",
    //     },
    //     {
    //         id: 8,
    //         name: "Samantha Brooks",
    //         role: "HR Manager",
    //         team: "HR",
    //         status: "active",
    //         age: "31",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
    //         email: "samantha.brooks@example.com",
    //     },
    //     {
    //         id: 9,
    //         name: "Frank Harrison",
    //         role: "F. Manager",
    //         team: "Finance",
    //         status: "vacation",
    //         age: "33",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
    //         email: "frank.harrison@example.com",
    //     },
    //     {
    //         id: 10,
    //         name: "Emma Adams",
    //         role: "Ops Manager",
    //         team: "Operations",
    //         status: "active",
    //         age: "35",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
    //         email: "emma.adams@example.com",
    //     },
    //     {
    //         id: 11,
    //         name: "Brandon Stevens",
    //         role: "Jr. Dev",
    //         team: "Development",
    //         status: "active",
    //         age: "22",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
    //         email: "brandon.stevens@example.com",
    //     },
    //     {
    //         id: 12,
    //         name: "Megan Richards",
    //         role: "P. Manager",
    //         team: "Product",
    //         status: "paused",
    //         age: "28",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
    //         email: "megan.richards@example.com",
    //     },
    //     {
    //         id: 13,
    //         name: "Oliver Scott",
    //         role: "S. Manager",
    //         team: "Security",
    //         status: "active",
    //         age: "37",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
    //         email: "oliver.scott@example.com",
    //     },
    //     {
    //         id: 14,
    //         name: "Grace Allen",
    //         role: "M. Specialist",
    //         team: "Marketing",
    //         status: "active",
    //         age: "30",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
    //         email: "grace.allen@example.com",
    //     },
    //     {
    //         id: 15,
    //         name: "Noah Carter",
    //         role: "IT Specialist",
    //         team: "I. Technology",
    //         status: "paused",
    //         age: "31",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
    //         email: "noah.carter@example.com",
    //     },
    //     {
    //         id: 16,
    //         name: "Ava Perez",
    //         role: "Manager",
    //         team: "Sales",
    //         status: "active",
    //         age: "29",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
    //         email: "ava.perez@example.com",
    //     },
    //     {
    //         id: 17,
    //         name: "Liam Johnson",
    //         role: "Data Analyst",
    //         team: "Analysis",
    //         status: "active",
    //         age: "28",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
    //         email: "liam.johnson@example.com",
    //     },
    //     {
    //         id: 18,
    //         name: "Sophia Taylor",
    //         role: "QA Analyst",
    //         team: "Testing",
    //         status: "active",
    //         age: "27",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
    //         email: "sophia.taylor@example.com",
    //     },
    //     {
    //         id: 19,
    //         name: "Lucas Harris",
    //         role: "Administrator",
    //         team: "Information Technology",
    //         status: "paused",
    //         age: "32",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
    //         email: "lucas.harris@example.com",
    //     },
    //     {
    //         id: 20,
    //         name: "Mia Robinson",
    //         role: "Coordinator",
    //         team: "Operations",
    //         status: "active",
    //         age: "26",
    //         avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
    //         email: "mia.robinson@example.com",
    //     },
    // ];

    // const arrayValues = Array.from(values);

    // const topContent = useMemo(() => {
    //     if (!arrayValues.length) {
    //         return null;
    //     }

    //     return (
    //         <ScrollShadow
    //             hideScrollBar
    //             className="w-full flex py-0.5 px-2 gap-1"
    //             orientation="horizontal"
    //         >
    //             {arrayValues.map((value) => (
    //                 <Chip key={value}>
    //                     {users?.find((user) => `${user?.id}` === `${value}`).name}
    //                 </Chip>
    //             ))}
    //         </ScrollShadow>
    //     );
    // }, [arrayValues.length]);

    const rows = () => {
        let sortedEmp = employees;
        if (searchQuery) {
            sortedEmp = sortedEmp?.filter(
                (emp) =>
                    emp.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    emp.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (sortedDept) {
            sortedEmp = sortedEmp?.filter(
                (emp) => emp?.departmentId?.name == sortedDept
            );
        }
        return sortedEmp;
    };
    useEffect(() => {
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
                res.data.map((dept) => (dept.value = dept.name));
                setDepartments(res.data);
            } catch (e) {
                console.log({ e });
            }
        };
        getDepartments();
        getEmployees();
    }, []);

    const checkIn = async () => {
        try {
            const res = await axiosPrivate.post<CheckInResponse>(
                "/attendance",
                {
                    userId: selectedEmpId,
                },
                {
                    headers: { "Content-Type": "application/json" },

                    withCredentials: true,
                }
            );
            const attendance = res.data.attendance;
            console.log({ attendance });
            const checkedInUser = employees?.find(
                (emp) => emp._id == attendance.userId
            );
            toast({
                title: `${checkedInUser?.name}: has checked in `,
                description: format(
                    parseISO(attendance.checkInTime.toString()),
                    "EEEE, MMMM dd, yyyy 'at' h:mm a"
                ),
            });
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(e.status);
                toast({
                    title: `Error `,
                    description: e.response?.data?.error,
                });
            } else {
                console.log(e);
                toast({
                    title: `Error `,
                    description: "Something has went wrong, please try again",
                });
            }
        }
    };
    const handleSave = () => {
        if (!selectedEmpId) onOpen();
        checkIn();
    };
    const handleCancel = () => {};
    return (
        <div className="flex flex-1 flex-col px-[4%] items-center pb-4">
            <BlurModal
                title="Employee selection missing"
                body="You must select an employee to perform timekeeping"
                isOpen={isOpen}
                onClose={onClose}
            />
            <div className="flex gap-3 self-end mb-2">
                <RegularButton label="save" callback={handleSave} />
                <RegularButton
                    label="cancel"
                    additionalStyle="bg-[#BDBDBD]"
                    callback={handleCancel}
                />
            </div>
            <div className="flex flex-1 bg-white w-full min-h-unit-3 items-start py-16 px-28 gap-14">
                <CustomDropdown
                    onSelect={setSortedDept}
                    options={departments}
                    label="Department"
                    placeholder="Select department"
                    buttonStyle="bg-white border"
                    additionalStyle="flex-1"
                />
                <div className="flex flex-1 flex-col">
                    <Input
                        className="rounded w-auto flex-1"
                        classNames={{
                            inputWrapper: "bg-white border",
                        }}
                        radius="sm"
                        variant="bordered"
                        key={"a"}
                        type="email"
                        placeholder="Search"
                        labelPlacement={"outside"}
                        label={
                            <p className="text-[#5B5F7B] font-medium">
                                Employee code
                            </p>
                        }
                        endContent={
                            <div className="bg-black p-1 rounded opacity-80">
                                <SearchIcon />
                            </div>
                        }
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {rows() && (
                        <Listbox
                            // topContent={topContent}
                            classNames={{
                                base: "max-w-full",
                                list: "max-h-[300px] w-full overflow-y-scroll",
                            }}
                            // defaultSelectedKeys={["1"]}
                            items={rows()}
                            label="Assigned to"
                            selectionMode="single"
                            onSelectionChange={(key) => {
                                setValues(key);
                                let selectedArray: Key[] = [];
                                if (key instanceof Set) {
                                    selectedArray = Array.from(key);
                                }
                                setSelectedEmpId(
                                    selectedArray[0]?.toString() || undefined
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
                                            src={item.avatarImage}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceForm;
