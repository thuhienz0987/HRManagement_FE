"use client";
import Link from "next/link";
import "./globals.css";
import Lottie from "lottie-react";
import NotFoundJSON from "../assets/lotties/404.json";

export default function FourOhFour() {
    return (
        <section className="flex flex-col gap-12 items-center justify-center h-screen">
            <div className="w-1/2 flex flex-col relative">
                <h1 className="font-extrabold text-2xl text-bar absolute self-center z-10 top-40"></h1>
                <Lottie animationData={NotFoundJSON} />
            </div>
            <div>
                <p className="text-xl max-w-2xl text-center inline">
                    Oops! We can’t find the page that you’re looking for!{" "}
                </p>
                <a href="/dashboard" className="text-xl underline inline">
                    Return to Home Page
                </a>
            </div>
        </section>
    );
}
