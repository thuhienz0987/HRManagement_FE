"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import InputText from "src/components/inputText";
import axios from "src/apis/axios";
import useAuth from "src/hooks/useAuth";
import { useSearchParams } from "next/navigation";

import * as yup from "yup";
import { useFormik } from "formik";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const resetPayLoadSchema = yup.object({
  otp: yup.number().required("OTP cannot be blank"),
  password: yup
    .string()
    .required("Password can not be blank")
    .min(6, "Password length must be more than 6 characters")
    .max(16, "Password length must be less than 16 characters")
    .matches(
      passwordRegex,
      "Password must contain uppercase, lowercase and number characters"
    ),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type Props = {};

const ResetPassword = () => {
  // const searchParams = useSearchParams();
  // console.log(searchParams.get("email"));

  // const { setAuth } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState({
    otp: "",
    password: "",
    passwordConfirm: "",
  });

  // Formik hook to handle the form state
  const formik = useFormik({
    initialValues: {
      otp: "",
      password: "",
      passwordConfirm: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: resetPayLoadSchema,

    // Handle form submission
    onSubmit: async ({ otp, password }) => {
      try {
        const response = await axios.post(
          `/reset-password/${"651b919498bf3396039b12fc"}`,
          JSON.stringify({ otp, password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("success", JSON.stringify(response.data));
        // const accessToken = response?.data?.accessToken;
        console.log(response.data);
        // setAuth({ otp, accessToken });
        router.push("/signIn");
      } catch (err: any) {
        console.log("err", err.response.data);
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, handleChange, handleSubmit }: any = formik;

  // const { owner } = router.query;
  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch("/");
  }, [router]);

  return (
    <main className="flex bg-center h-screen w-screen flex-col items-center justify-center p-5 bg-no-repeat bg-fixed bg-cover bg-[url('../../public/assets/images/background.png')] min-h-[75%]">
      <div className="flex flex-col w-5/6 md:w-5/6 lg:w-1/3 lg:self-end sm:w-5/6 h-3/4 self-center lg:self_end sm:self-center justify-center items-center bg-primaryAuth rounded-2xl ">
        <div className="w-2/3 flex flex-col items-center">
          <div className="text-[#FAF9F6] font-bold text-2xl w-full">
            FORGOT PASSWORD
          </div>
          <InputText
            placeHolder="Enter OTP"
            id="otp"
            value={formik.values.otp}
            onChange={handleChange}
            label="OTP"
          />
          {errors.otp && touched.otp && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.otp}
            </span>
          )}

          <InputText
            type="password"
            placeHolder="Enter password"
            id="password"
            value={formik.values.password}
            onChange={handleChange}
            label="New password"
          />
          {errors.password && touched.password && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.password}
            </span>
          )}

          <InputText
            type="password"
            placeHolder="Confirm new password"
            id="passwordConfirm"
            value={formik.values.passwordConfirm}
            onChange={handleChange}
            label="Confirm new password"
          />
          {errors.passwordConfirm && touched.passwordConfirm && (
            <span className="text-[#ff2626] mt-2 text-[7px] font-bold self-start ml-4">
              {errors.passwordConfirm}
            </span>
          )}

          <div className="w-full h-10 flex mt-5">
            <button
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

export default ResetPassword;
