"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosPrivate } from "src/apis/axios";
import useRefreshToken from "src/hooks/useRefreshToken";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { data: session } = useSession();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers[
                        "Authorization"
                    ] = `Bearer ${session?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    if (newAccessToken) {
                        prevRequest.headers[
                            "Authorization"
                        ] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } else {
                        await signOut({
                            callbackUrl: "/",
                            redirect: true,
                        });
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [session?.accessToken, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
