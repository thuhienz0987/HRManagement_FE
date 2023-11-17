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
                    return user;
                    // setAuth({ email: user.email, accessToken });
                    // router.push("/dashboard");
                } catch (err: any) {
                    console.log("err", err.response.data);
                    return null;
                }
                // const res = await fetch("/your/endpoint", {
                //     method: "POST",
                //     body: JSON.stringify(credentials),
                //     headers: { "Content-Type": "application/json" },
                // });
                // const user = await res.json();

                // // If no error and we have user data, return it
                // if (res.ok && user) {
                //     return user;
                // }
                // // Return null if user data could not be retrieved
                // return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
};
