"use client"

import ChatArea from "@/components/ChatArea";
import ChatNav from "@/components/ChatNav";
import SigninHome from "@/components/SigninHome";
import { useClientSession } from "@/lib/sessionUtils";


export default function Home() {

  const session = useClientSession();

  if(!session || !session.user || !session.user.email) return (
    <SigninHome />
  )

  return (
    <main className="w-full h-full flex flex-1 max-h-full max-w-full">
        <ChatNav className="chats w-80" session={session}/>
        <ChatArea className="Chatarea flex-1 bg-black max-w-[calc(100%-320px)]" session={session}/>
    </main>
  );
}