import { z } from "zod"
import { CustomSession } from "./sessionUtils";

const SocketMessageResponseSchema = z.object({
    status: z.string(),
    type: z.string(),
    message: z.string(),
    image: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional()
})

export async function handleMessage(data: any, chatDataContext: ChatDataContext, session: CustomSession) {
    try {
        const messageObject = await JSON.parse(data);
        const parsedMessage = SocketMessageResponseSchema.parse(messageObject);


        const { type, from, to } = parsedMessage;

        switch (type) {
            case "m": {
                if (!from) throw ("Invalid message");
                const messageGenerated: Message = {
                    sender: from,
                    receiver: session.user.email,
                    message: parsedMessage.message,
                    time: new Date(),
                    status: "DELIVERED"
                }

                // if (!chatDataContext.chats) throw ("Error: No chats")
                chatDataContext.setChats((prev: ChatObject) => {
                    let newChats =  {
                        ...prev,
                        [from]: {
                            ...prev[from],
                            messages: [...prev[from].messages, messageGenerated]
                        },
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
            
                break;
            }

            case "f_a": {
                if (!from) throw ("Invalid request");

                chatDataContext.setFriends((prev: string[]) => {
                    return [...prev, from]
                })
                chatDataContext.setReceivedRequests((prev: string[]) => {
                    return prev.filter(friend => friend != from)
                })
                chatDataContext.setSentRequests((prev: string[]) => {
                    return prev.filter(friend => friend != from)
                })

                const chatID = BigInt(parsedMessage.message)

                chatDataContext.setChats((prev: ChatObject) => {
                    const newChat: Chat = {
                        chatID,
                        recipient: from,
                        messages: []
                    }
                    return {...prev, [from]: newChat}
                })
                break;
            }

            case "f_s": {
                if (!to) throw ("Invalid request");

                chatDataContext.setSentRequests((prev: string[]) => {
                    return [...prev, to];
                })

                break;
            }

            case "f_r": {
                if (!from) throw ("Invalid request");

                chatDataContext.setReceivedRequests((prev: string[]) => {
                    return [...prev, from];
                })

                break;
            }
        }
    } catch (error) {
        console.log(error);
    }

}