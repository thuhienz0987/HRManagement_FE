"use client";
import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const NextNProgressClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <Next13ProgressBar
                height="4px"
                color="#C89E31"
                options={{ showSpinner: false }}
                showOnShallow
            />
        </>
    );
};

export default NextNProgressClient;
