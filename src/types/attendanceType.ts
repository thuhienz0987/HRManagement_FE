export interface Attendance {
    userId: string;
    attendanceDate: Date;
    checkInTime: Date;
    checkOutTime?: Date;
    overTime: number;
    _id: string;
}
