import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import Github from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Adapter } from "next-auth/adapters"
import prisma from "@/prisma/db"
import { getChatToken } from "./ChatToken"
import { credentialsSchema } from "./zodSchemas"



const nextAuthConfig: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        Github({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || ""
        }),
        CredentialsProvider({
            credentials: {
                email: { label: 'Decoy Email', type: "email", placeholder: "Email" },
                password: { label: 'Password', type: "password" }
            },
            authorize: async (credentials, req) => {
                try {
                    credentials = credentialsSchema.parse(credentials);
                    const userExists = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    })

                    if (userExists) {
                        if (!userExists.password || userExists.password == "") throw new Error("Email already exits");
                        const userToken = { id: userExists.id, email: userExists.email }
                        if (credentials.password != userExists.password) throw new Error("Invalid email/password");
                        return userToken;
                    } else {
                        const userCreated = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                password: credentials.password
                            }
                        })
                        return { id: userCreated.id, email: credentials.email };
                    }
                } catch (error) {
                    console.log(error);
                    throw error
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({token, user, account}) => {
            // console.log("jwt callback", token, user);
            return token;
        },
        session: async ({ session, token, user }) => {
            // console.log("seesion callback", token, session);
            
            const chatToken = getChatToken(token.email!);
            return {
                ...session,
                chatToken
            }
        },
        signIn: async ({ user, account, profile, email, credentials }) => {
            // console.log("signin callback", user);
            return true;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages : {
        signIn: "/"
    }
}

export default nextAuthConfig;