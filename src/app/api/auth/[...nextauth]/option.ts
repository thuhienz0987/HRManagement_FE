import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "src/apis/axios";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "email",
                    type: "text",
                },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log(credentials);
                try {
                    const response = await axios.post(
                        "/login",
                        JSON.stringify(credentials),
                        {
                            headers: { "Content-Type": "application/json" },
                            withCredentials: true,
                        }
                    );
                    console.log("success", JSON.stringify(response.data));
                    const accessToken = response?.data?.accessToken;
                    const user = response?.data?.user;
                    console.log(response.data);
                    user.accessToken = response.data.accessToken;
                    return user;
                    // setAuth({ email: user.email, accessToken });
                    // router.push("/dashboard");
                } catch (err: any) {
                    console.log("err", err.response.data);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if(trigger === 'update') {
                if(session.newAccessToken) {
                    token.accessToken = session.newAccessToken
                }
              }
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token as any;
            session.accessToken = token.accessToken as any
            return session;
        },
    },
    pages: {
        signIn: "/signIn",
    },
};
