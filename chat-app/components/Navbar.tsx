"use client"

import { signIn, signOut } from "next-auth/react";

export default function Navbar() {
    return (
        <div className="flex justify-between w-full">
            <div>ChatApp</div>
            <div className="flex gap-8">
                <button onClick={() => signIn()}>Signin</button>
                <button onClick={() => signOut()}>Signout</button>
            </div>
        </div>
    )
}