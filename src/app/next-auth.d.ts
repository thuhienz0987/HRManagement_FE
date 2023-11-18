import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
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
            positionId: string;
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
