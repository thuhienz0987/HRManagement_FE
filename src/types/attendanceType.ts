export interface Attendance {
    userId: string;
    attendanceDate: string;
    checkInTime: string;
    checkOutTime?: string;
    overTime: number;
    _id: string;
}
