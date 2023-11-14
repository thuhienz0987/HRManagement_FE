"use client";

import axios from "../apis/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get(
            '/refresh', 
            {
                withCredentials: true
            }
        );
        setAuth((prev: any) => {
            console.log('refresh token',JSON.stringify(prev));
            console.log('refresh token',response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken}
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;