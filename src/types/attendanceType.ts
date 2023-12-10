import { User } from "./userType";

export interface Attendance {
    userId: User;
    attendanceDate: string;
    checkInTime: string;
    checkOutTime?: string;
    overTime: number;
    _id: string;
}
