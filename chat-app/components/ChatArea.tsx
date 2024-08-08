"use client"

import { useChatData } from "@/contexts/ChatDataContext"
import { useSocket } from "@/contexts/SocketContext";
import { CustomSession } from "@/lib/sessionUtils";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import InfoChat from "./InfoChat";
import LoadingChat from "./LoadingChat";
import MessageTile from "./MessageTile";

function ChatArea({ className, session }: { className: string, session: CustomSession }) {

    const chatDataContext = useChatData();
    const socketContext = useSocket();


    const { socket } = socketContext;
    const { activeChat, setActiveChat } = chatDataContext;

    const [messageInput, setMessageInput] = useState<string>("");

    if (socketContext.socketIsLoading) {
        return (
            <LoadingChat className={className} />
        )
    }

    const { chats } = chatDataContext;
    if (!chats || !chats[activeChat]) {
        return (
            <InfoChat className={className} />
        )
    }
    const currentChat = chats[activeChat];


    function handleMessageSend() {
        const messageText = messageInput.trim();
        if (messageText == "") return;

        const toSend = {
            type: "m",
            to: currentChat.recipient,
            message: messageText,
            chatID: currentChat.chatID.toString()
        }

        socket?.send(JSON.stringify(toSend));

        const messageGenerated: Message = {
            sender: session.user.email,
            receiver: currentChat.recipient,
            message: messageText,
            time: new Date(),
            status: "DELIVERED"
        }

        if (!chatDataContext.chats) return
        chatDataContext.setChats((prev: ChatObject) => {
            let newChats = {
                ...prev,
                [currentChat.recipient]: {
                    ...prev[currentChat.recipient],
                    messages: [...prev[currentChat.recipient].messages, messageGenerated]
                }
            }

            let chatArray = Object.entries(newChats);
            chatArray.sort(([, a], [, b]) => {
                const latestTimeA = a.messages[0] ? new Date(a.messages[a.messages.length - 1].time).getTime() : new Date(0).getTime();
                const latestTimeB = b.messages[0] ? new Date(b.messages[b.messages.length - 1].time).getTime() : new Date(0).getTime();
                return latestTimeB - latestTimeA;
            });
            newChats = Object.fromEntries(chatArray);
            return newChats;
        })
        setMessageInput("");
    }

    return (
        <div className={className + " " + "max-h-full flex flex-col min-w-0 bg-stone-900"}>
            <div className="text-lg h-16 text-center leading-[4rem] border-b-2 border-slate-600">{activeChat}</div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 min-h-0 max-w-full max-h-[calc(100%-136px)] min-w-0">
                {currentChat.messages && currentChat.messages.map((message, index) =>
                    <MessageTile key={index} message={message} userEmail={session.user.email}
                    />)}
            </div>
            <div className="flex gap-8 text-lg p-4 text-black">
                <Input type="text" id="messageInput" className="dark flex-1 min-w-10 text-light"
                    value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                <Button onClick={handleMessageSend}>Send</Button>
            </div>
        </div>
    )
}

export default ChatArea
