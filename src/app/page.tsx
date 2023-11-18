import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";

type Props = {};

export default async function Home(props: Props) {
    const session = await getServerSession(options);
    console.log({ session });

    if (!session) {
        redirect("/login");
    } else {
        redirect("/dashboard");
    }
}
