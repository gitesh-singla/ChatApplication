"use server"

// import { getChatID } from "@/lib/ChatHelpers";
import { useServerSession } from "@/lib/sessionUtils";
import prisma from "@/prisma/db";

export async function searchUsers(searchInput: string) {
    try {
        const session = await useServerSession()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { friends: true }
        });

        if (!user) throw ("Invalid User")

        const friendEmails = user.friends.map((friend) => friend.email)

        const searchedUsers = await prisma.user.findMany({
            where: {
                email: {
                    contains: searchInput,
                    notIn: [...friendEmails, user.email],
                }
            }
        })

        const res = searchedUsers.map((element) => {
            return {
                email: element.email,
                image: element.image
            }
        })

        return { data: res }
    } catch (error) {
        console.log("In searchUsers action", error);
        return { error };
    }
}

export async function getChats() {
    try {
        const session = await useServerSession();

        const userData = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                chats: true
            }
        })

        const userChatIDs = userData?.chats.map(chat => chat.chatID);

        const userChats = await prisma.chat.findMany({
            where: {
                id: {
                    in: userChatIDs
                },
            },
            include: {
                messages: {
                    orderBy: {
                        time: "asc"
                    }
                },
                members: true
            }
        })

        userChats.sort((a, b) => {
            const latestTimeA = a.messages[0] ? new Date(a.messages[a.messages.length - 1].time).getTime() : new Date(0).getTime();
            const latestTimeB = b.messages[0] ? new Date(b.messages[b.messages.length - 1].time).getTime() : new Date(0).getTime();
            return latestTimeB - latestTimeA;
        });

        let recipients: string[] = [];

        const chatData: ChatObject = {};
        userChats.map(userChat =>{

            const recipient = userChat.members[0].userEmail != userData?.email ? userChat.members[0].userEmail : userChat.members[1].userEmail;
            recipients.push(recipient);
            const messages = userChat.messages.map(message => {
                return (
                    {
                        sender: message.sender,
                        receiver: message.receiver,
                        message: message.message,
                        time: message.time,
                        status: message.status
                    }
                )
            })

            chatData[recipient] = {
                chatID: userChat.id,
                recipient,
                messages
            }
            return;
        })


        const recipientsData = await prisma.user.findMany({
            where: {
                email: {
                    in: recipients
                }
            }
        })

        recipientsData.map((recipient) => {
            chatData[recipient.email] = {
                ...chatData[recipient.email],
                image: recipient.image || undefined
            }
        })

        return chatData
    } catch (error) {
        console.log(error);
        return {}

    }

}

export async function getFriendsData() {
    try {
        const session = await useServerSession();
        const userData = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                friends: true
            }
        })

        const friends = userData?.friends.map(friend => friend.email);
        const res = {
            friends,
            sentRequests: userData?.friendRequestsSent,
            receivedRequests: userData?.friendRequestsReceived
        }

        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// export async function sendFriendRequest(input: string) {
//     try {
//         const session = await useServerSession();


//         await prisma.user.update({
//             where: {
//                 email: session.user.email
//             },
//             data: {
//                 friendRequestsSent: {
//                     push: input
//                 }
//             }
//         })
//         await prisma.user.update({
//             where: {
//                 email: input
//             },
//             data: {
//                 friendRequestsReceived: {
//                     push: session.user.email
//                 }
//             }
//         })

//     } catch (error) {
//         console.log(error);
//         return { error };
//     }
// }

// export async function sendMessage(message: string, to: string) {
//     try {
//         const session = await useServerSession();
//         const chatID = await getChatID(session.user.email, to);


//         await prisma.message.create({
//             data: {
//                 sender: session.user.email,
//                 receiver: to,
//                 message: message,
//                 chatId: chatID,
//                 status: "DELIVERED"
//             }
//         })

//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }

// export async function getFreindRequests() {
//     try {
//         const session = await useServerSession();

//         const userData = await prisma.user.findUnique({
//             where: {
//                 email: session.user.email
//             },
//         })


//         return userData?.friendRequestsReceived;
//     } catch (error) {
//         console.log(error);
//         return [];

//     }
// }
// export async function acceptFriendRequest(sender: string) {

//     try {
//         const session = await useServerSession();

//         const receiver = session.user.email

//         const userSender = await prisma.user.findUnique({
//             where: {
//                 email: sender
//             }
//         })
//         const sentRequests = userSender?.friendRequestsSent;
//         const updateSentRequests = sentRequests?.filter(id => id !== receiver);
//         await prisma.user.update({
//             where: {
//                 email: sender
//             },
//             data: {
//                 friendRequestsSent: updateSentRequests,
//                 friends: {
//                     connect: { email: receiver }
//                 }
//             }
//         })

//         const userReceiver = await prisma.user.findUnique({
//             where: {
//                 email: receiver
//             }
//         })
//         const receivedRequests = userReceiver?.friendRequestsSent;
//         const updateReceivedRequests = receivedRequests?.filter(id => id !== sender);
//         await prisma.user.update({
//             where: {
//                 email: receiver
//             },
//             data: {
//                 friendRequestsReceived: updateReceivedRequests,
//                 friends: {
//                     connect: { email: sender }
//                 }
//             }
//         })

//         const chatID = createChat(receiver, sender);
//     } catch (error) {
//         console.log(error);

//     }
// }

// export async function createChat(user1: string, user2: string) {
//     const chat = await prisma.chat.create({});
//     await prisma.usersOnChats.create({
//         data: {
//             userEmail: user1,
//             chatID: chat.id
//         }
//     })
//     await prisma.usersOnChats.create({
//         data: {
//             userEmail: user2,
//             chatID: chat.id
//         }
//     })
//     return chat.id;
// }

