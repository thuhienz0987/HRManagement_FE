export interface Event {
    _id: string;
    name: string;
    description: string;
    dateTime: string;
    room: string;
    users: {
        user: string;
        mandatory: boolean;
    }[];
}
