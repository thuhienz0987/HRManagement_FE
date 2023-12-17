"use client";
import React, { useState, useEffect, useCallback } from "react";
import "../../../globals.css";
import { useRouter } from "next13-progressbar";
import InputText from "src/components/inputText";
import axios from "src/apis/axios";
import Link from "next/link";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import { useFormik } from "formik";

type Props = {};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const signInPayLoadSchema = yup.object({
  email: yup
    .string()
    .required("Email cannot be blank")
    .email("Invalid email")
    .max(50, "Email length must be less than 50 characters"),
  password: yup
    .string()
    .required("Password can not be blank")
    .min(6, "Password length must be more than 6 characters")
    .max(16, "Password length must be less than 16 characters")
    .matches(
      passwordRegex,
      "Password must contain uppercase, lowercase and number characters"
    ),
});

// export interface IFormValues {
//   email: string;
//   password: number;
// }

const SignInForm = (props: Props) => {
  const router = useRouter();

  // Formik hook to handle the form state
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: signInPayLoadSchema,

    // Handle form submission
    onSubmit: async ({ email, password }) => {
      try {
        console.log({ email }, { password });
        const response = await axios.post(
          "/login",
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("success", JSON.stringify(response.data));
        const accessToken = response?.data?.accessToken;
        console.log(response.data);
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "http://localhost:3000/dashboard",
        });
        router.push("/dashboard");
      } catch (err: any) {
        console.log("err", err.response.data);
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/dashboard");
  }, [router]);

  return (
    <main className="flex bg-center h-screen w-screen flex-col items-center justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')] min-h-[75%]">
      <div className="flex flex-col w-5/6 md:w-5/6 lg:w-1/3 lg:self-end sm:w-5/6 h-3/4 self-center lg:self_end sm:self-center justify-center items-center bg-primaryAuth rounded-2xl">
        <div className="w-2/3 flex flex-col items-center justify-center">
          <div className="text-[#FAF9F6] font-bold text-3xl">SIGN IN</div>

          <InputText
            placeHolder="Enter your email"
            id="email"
            value={formik.values.email}
            onChange={handleChange}
            label="Email"
          />
          {errors.email && touched.email && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.email}
            </span>
          )}

          <InputText
            placeHolder="Enter your password"
            id="password"
            value={formik.values.password}
            onChange={handleChange}
            label="Password"
            type="password"
          />
          {errors.password && touched.password && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.password}
            </span>
          )}

          <div className="self-end">
            <p className="text-[#FAF9F6] text-xs font-medium">
              <Link href="/forgotPassword">Forgot password ?</Link>
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
              type="button"
              onClick={handleSubmit}
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
