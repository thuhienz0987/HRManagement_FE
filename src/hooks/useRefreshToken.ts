"use client";

import { useSession } from "next-auth/react";
import axios from "../apis/axios";

const useRefreshToken = () => {
    const { data: session } = useSession();
    const refresh = async () => {
        try {
            const response = await axios.post(
                "/refresh",
                {
                    refreshToken: session?.user.refreshToken,
                },
                {
                    withCredentials: true,
                }
            );
            if (session) session.accessToken = response.data.accessToken;
            console.log("refreshed");
            return response.data.accessToken;
        } catch (e) {
            return null;
        }
    };
    return refresh;
};

export default useRefreshToken;
