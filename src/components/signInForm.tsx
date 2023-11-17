"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import InputText from "src/components/inputText";
import axios from "src/apis/axios";
import { signIn } from "next-auth/react";

type Props = {};

export interface IFormValues {
    email: string;
    password: number;
}

const SignInForm = (props: Props) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IFormValues>();

    const router = useRouter();

    const onSubmit: SubmitHandler<IFormValues> = async (data, e) => {
        e?.preventDefault();
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true,
            callbackUrl: "http://localhost:3000/dashboard",
        });
    };

    // const SignIn = async () => {
    //     try {
    //         const response = await axios.post(
    //             "/login",
    //             JSON.stringify({ email: user.email, password: user.password }),
    //             {
    //                 headers: { "Content-Type": "application/json" },
    //                 withCredentials: true,
    //             }
    //         );
    //         console.log("success", JSON.stringify(response.data));
    //         const accessToken = response?.data?.accessToken;
    //         console.log(response.data);
    //         setAuth({ email: user.email, accessToken });
    //         router.push("/dashboard");
    //     } catch (err: any) {
    //         console.log("err", err.response.data);
    //     }
    // };
    useEffect(() => {
        // Prefetch the dashboard page
        router.prefetch("/dashboard");
    }, [router]);
    return (
        <main className="flex bg-center h-screen w-screen flex-col items-center justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')] min-h-[75%] ">
            <div className="flex flex-col w-5/6 md:w-5/6 lg:w-1/3 lg:self-end sm:w-5/6 h-3/4 self-center lg:self_end sm:self-center justify-center items-center bg-primaryAuth backdrop-blur-md ">
                <div className="w-2/3 flex flex-col items-center justify-center">
                    <div className="text-[#FAF9F6] font-bold text-3xl">
                        SIGN IN
                    </div>
                    <div>
                        <p className="text-[#FAF9F6] text-xs">
                            Enter your email and password
                        </p>
                    </div>
                    <InputText
                        placeHolder="Enter your email"
                        id="email"
                        label="Email"
                        register={register}
                    />
                    <InputText
                        placeHolder="Enter your password"
                        id="password"
                        label="Password"
                        type="password"
                        register={register}
                    />

                    <div className="self-end">
                        <p className="text-[#FAF9F6] text-xs font-medium">
                            <i>Forgot password ?</i>
                        </p>
                    </div>

                    <div className="flex items-center flex-row self-start">
                        <input
                            id="default-checkbox"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 text-[#24243f] bg-gray-100 border-gray-300 rounded focus:ring-[#24243f] dark:focus:ring-[#24243f] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                            htmlFor="default-checkbox"
                            className="text-[#FAF9F6] text-xs font-medium ml-2"
                        >
                            Remember password
                        </label>
                    </div>

                    <div className="w-full mt-3 h-10 flex">
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="w-full bg-white hover:bg-[#24243f] text-[#24243f] hover:text-[#FAF9F6] hover:border-[#FAF9F6] rounded-md font-bold"
                        >
                            SIGN IN
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignInForm;
