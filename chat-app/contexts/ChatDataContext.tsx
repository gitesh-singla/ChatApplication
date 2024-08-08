"use client"

import { getChats, getFriendsData } from "@/app/actions/actions";
import { createContext, useContext, useEffect, useMemo, useState } from "react";



const ChatDataContext = createContext<ChatDataContext | undefined>(undefined);

export default function ChatDataContextProvider({ children }: { children: React.ReactNode }) {

    const [chats, setChats] = useState<ChatObject>({})
    const [friends, setFriends] = useState<string[]>()
    const [sentRequests, setSentRequests] = useState<string[]>()
    const [receivedRequests, setReceivedRequests] = useState<string[]>()
    const [activeChat, setActiveChat] = useState<string>("")


    async function fetchChats() {
        const data = await getChats();
        setChats(data)
        const friendData = await getFriendsData();
        setFriends(friendData?.friends)
        setSentRequests(friendData?.sentRequests)
        setReceivedRequests(friendData?.receivedRequests)
    }

    useEffect(() => {
        fetchChats();
    }, [])
    
    return (
        <ChatDataContext.Provider value={{
            chats, friends, sentRequests, receivedRequests, activeChat,
            setChats, setSentRequests, setReceivedRequests, setFriends, setActiveChat
        }}>
            {children}
        </ChatDataContext.Provider>
    )
}

export function useChatData() {
    const data = useContext(ChatDataContext);
    if (!data) throw ("Error fetching data")
    return data;
}