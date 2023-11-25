import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            email: string;
            name: string;
            accessToken: string;
            roles: string[];
            phoneNumber: string;
            birthday: Date;
            address: string;
            gender: string;
            homeTown: string;
            ethnicGroup: string;
            avatarImage: string;
            code: string;
            isEmployee: boolean;
            positionId: {
                _id: string;
                code: string;
                name: string;
                basicSalary: number;
                isDeleted: boolean;
            };
            departmentId: {
                _id: string;
                code: string;
                name: string;
                managerId: string;
                isDeleted: boolean;
            };
            teamId: {
                _id: string;
                code: string;
                name: string;
                managerId: string;
                departmentId: string;
                isDeleted: boolean;
            };
        } & DefaultSession;
    }

    interface User extends DefaultUser {
        roles: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        roles: string[];
    }
}
