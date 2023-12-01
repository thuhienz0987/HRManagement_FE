import { User } from "./userType";

export interface LeaveRequest {
    _id: string;
    reason: string;
    status: "approved" | "pending" | "denied";
    userId: User;
    endDate: string;
}
