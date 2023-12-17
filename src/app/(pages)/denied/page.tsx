"use client";
import Link from "next/link";
import "../../globals.css";
import Lottie from "lottie-react";
import ForbiddenJSON from "../../../assets/lotties/403.json";

export default function Denied() {
    return (
        <section className="flex flex-col gap-12 items-center justify-center h-screen">
            <div className="w-1/2 flex flex-col relative">
                <div className="flex absolute top-28 self-center z-10 gap-4">
                    <p className="text-5xl text-bar font-black">4</p>
                    <p className="text-5xl text-button font-black">0</p>
                    <p className="text-5xl text-bar font-black">3</p>
                </div>

                <h1 className="font-extrabold text-2xl text-bar absolute self-center z-10 top-40">
                    ACCESS DENIED
                </h1>
                <Lottie animationData={ForbiddenJSON} />
            </div>
            <div>
                <p className="text-xl max-w-2xl text-center inline">
                    Sorry, but you don’t have permission to access this page!{" "}
                </p>
                <a href="/dashboard" className="text-xl underline inline">
                    Return to Home Page
                </a>
            </div>
        </section>
    );
}
