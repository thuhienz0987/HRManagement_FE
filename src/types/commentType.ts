import { User } from "./userType";

export interface CommentSend {
    reviewerId: string;
    revieweeId: string;
    rate: number;
    comment: string;
}

export interface CommentGet {
    _id: string;
    reviewerId: User;
    revieweeId: User;
    rate: number;
    comment: string;
    commentMonth: string;
}
