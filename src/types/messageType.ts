import {User} from './userType'

export interface Message {
    sender: User;
    receiver: User;
    message: string;
    timestamp: Date;
  }

