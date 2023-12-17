import { Allowances } from "./allowancesType";
import { CommentGet } from "./commentType";
import { Position, User } from "./userType";

export interface Salary {
    _id: string;
    userId: User;
    idComment: CommentGet;
    idPosition: Position;
    bonus: number[];
    idAllowance: Allowances[];
    incomeTax: number;
    payDay: string;
    presentDate: number;
    totalSalary: string;
    totalIncome: string;
    incomeTaxAmount: string;
    overTimeDay: number;
    overTime: number;
    paidLeaveDays: number;
    totalLeaveRequest: number;
    overTimeMoney: string;
    overTimeDayMoney: string;
    dayMoney: string;
    bonusMoney: string;
    allowanceAmount: string;
    paidLeaveDaysMoney: string;
    createdAt: string;

}
