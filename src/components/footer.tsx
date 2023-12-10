import Image from "next/image";
import React from "react";
import { Toaster } from "../../@/components/ui/toaster";

function Footer() {
    return (
        <footer className="w-full bg-[#f6f6f6] flex justify-between h-12 items-center px-4  bottom-0 ">
            <Toaster />
            <span className="text-[#525960]">Footer</span>
        </footer>
    );
}

export default Footer;
