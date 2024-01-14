import Image from "next/image";
import React from "react";
import { Toaster } from "../../@/components/ui/toaster";

function Footer() {
    return (
        <footer className="w-full bg-[#f6f6f6] dark:bg-dark flex justify-between h-8 items-center px-4  bottom-0 ">
            <Toaster />
            <span className="text-[#B2B2B2] dark:text-button text-sm">© 2023 MultipleSolutions</span>
        </footer>
    );
}

export default Footer;
