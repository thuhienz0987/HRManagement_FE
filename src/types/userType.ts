export interface User {
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
    level: string;
    name: string;
    email: string;
}

export interface Department {
    code: string;
    name: string;
    managerId: string;
}

export interface Position {
    code: string;
    name: string;
    basicSalary: string;
}
