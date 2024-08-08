import { getServerSession, Session, User } from "next-auth";
import nextAuthConfig from "./nextAuthConfig";
import { SessionContextValue, useSession } from "next-auth/react";

// export const useServerSession = async () : Promise<Session> => {
//     const session = await getServerSession(nextAuthConfig);
//     if (!session || !session.user || !session.user.email) throw ("Invalid session")
//     return session
// }

interface CustomUser extends User {
    email: string,
    image?: string
}

export interface CustomSession extends Session {
    user: CustomUser
    chatToken: string;
}

const isValidSession = (session: CustomSession | null): session is CustomSession => {
    return !!session && !!session.user && !!session.user.email && !!session.chatToken;
}

export const useServerSession = async (): Promise<CustomSession> => {
    const session = await getServerSession(nextAuthConfig) as CustomSession;
    if (!isValidSession(session)) {
        throw new Error("Invalid session");
    }
    return session;
}

export const useClientSession = (): CustomSession | null => {
    const {data: session, status} = useSession();
    if(status != 'authenticated') return null;
    return session as CustomSession;
}