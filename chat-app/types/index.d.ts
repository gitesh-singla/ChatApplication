type Message = {
    sender: string,
    receiver: string,
    message: string,
    time: Date,
    status: "DELIVERED" | "UNDELIVERED" | "READ"
};

type Chat = {
    chatID: bigint,
    image?: string,
    recipient: string,
    messages: Message[]
};

type ChatObject = {
    [key: string]: Chat
}


type ChatDataContext = {
    chats: ChatObject | undefined,
    friends: string[] | undefined,
    sentRequests: string[] | undefined,
    receivedRequests: string[] | undefined,
    setChats: Dispatch<SetStateAction<Chat[] | undefined>>,
    setSentRequests: Dispatch<SetStateAction<string[] | undefined>>
    setReceivedRequests: Dispatch<SetStateAction<string[] | undefined>>
    setFriends: Dispatch<SetStateAction<string[] | undefined>>
    activeChat: string,
    setActiveChat: Dispatch<SetStateAction<string>>
}