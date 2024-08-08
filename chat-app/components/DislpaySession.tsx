import nextAuthConfig from "@/lib/nextAuthConfig";
import { getServerSession } from "next-auth";

export default async function DisplaySession () {
    const session = await getServerSession(nextAuthConfig);

    return (
        <div>{JSON.stringify(session)}</div>
    )
}