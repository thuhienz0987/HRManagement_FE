import { Metadata } from "next";
import Page from "./page"; // import your Demo's page

export const metadata: Metadata = {
  title: "Absent",
  description: "Absent",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}