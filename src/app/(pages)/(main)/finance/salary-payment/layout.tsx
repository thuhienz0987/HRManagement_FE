import { Metadata } from "next";
import Page from "./page"; // import your Demo's page

export const metadata: Metadata = {
  title: "Salary payment",
  description: "Salary payment",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
