import { Metadata } from "next";
import Page from "./page"; // import your Demo's page

export const metadata: Metadata = {
    title: "Attendance log",
    description: "Attendance log",
};
export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
