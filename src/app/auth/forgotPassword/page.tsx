"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputText from "src/components/inputText";
import axios from "src/apis/axios";
import useAuth from "src/hooks/useAuth";
import * as yup from "yup";
import { useFormik } from "formik";

type Props = {};

const forgotPayLoadSchema = yup.object({
  email: yup
    .string()
    .required("Email cannot be blank")
    .email("Invalid email")
    .max(50, "Email length must be less than 50 characters"),
});

const ForgotPassword = (props: Props) => {
  // const { setAuth } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: forgotPayLoadSchema,

    // Handle form submission
    onSubmit: async ({ email }) => {
      try {
        const response = await axios.post(
          "/forget-password",
          JSON.stringify({ email }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("success", JSON.stringify(response.data));
        // const accessToken = response?.data?.accessToken;
        console.log(response.data);
        // setAuth({ email, });
        router.push("/auth/resetPassword");
      } catch (err: any) {
        console.log("err", err.response.data);
      }
      router.prefetch("/signIn");
    },
  });

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/");
  }, [router]);
  return (
    <main className="flex bg-center h-screen w-screen flex-col items-center justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')] min-h-[75%]">
      <div className="flex flex-col w-5/6 md:w-5/6 lg:w-1/3 lg:self-end sm:w-5/6 h-3/4 self-center lg:self_end sm:self-center justify-start items-center bg-primaryAuth rounded-2xl ">
        <div className="w-2/3 flex flex-col items-center mt-10">
          <div className="text-[#FAF9F6] font-bold text-2xl w-full">
            FORGOT PASSWORD
          </div>
          <InputText
            placeHolder="Enter email"
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

          <div className="w-full mt-3 h-10 flex mt-5">
            <button
              // href={{
              //   pathname: "/auth/resetPassword",
              //   query: { email: JSON.stringify(user.email) },
              // }}
              onClick={handleSubmit}
              className="w-full bg-white hover:bg-[#24243f] text-[#24243f] hover:text-[#FAF9F6] hover:border-[#FAF9F6] rounded-md font-bold"
            >
              Confirm
            </button>
          </div>

          <div className="w-full flex text-white text-[18px] flex-row items-center justify-center mt-3">
            <p>Back to </p>
            <p> </p>
            <button
              onClick={() => router.push("/auth/signIn")}
              className="underline font-bold ml-2 hover:text-[#24243f]"
            >
              {" "}
              Sign in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
