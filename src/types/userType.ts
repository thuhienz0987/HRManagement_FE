export interface User {
    isOnline: string;
    _id: string;
    roles: string[];
    phoneNumber: string;
    birthday: string;
    address: string;
    gender: string;
    homeTown: string;
    ethnicGroup: string;
    avatarImage: string;
    code: string;
    positionId: Position;
    departmentId: Department;
    teamId: Team;
    level: string;
    name: string;
    email: string;
    dayOff?: string;
    salaryGrade: number;
    createdAt: string;
    isEmployee: boolean;
}

export interface Department {
    _id: string;
    code: string;
    name: string;
    managerId: User;
}

export interface Team {
    _id: string;
    code: string;
    departmentId: Department;
    name: string;
    managerId: User;
}

export interface Position {
    _id: string;
    code: string;
    name: string;
    basicSalary: string;
}
