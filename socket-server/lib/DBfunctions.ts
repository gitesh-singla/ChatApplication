import prisma from "../prisma/db";

export async function sendFriendRequest(from: string, to: string) {

    const sender = await prisma.user.findUnique({
        where: {
            email: from
        }
    })

    if (!sender?.friendRequestsSent.includes(to)) {
        await prisma.user.update({
            where: {
                email: from,
            },
            data: {
                friendRequestsSent: {
                    push: to
                }
            }
        })
    }

    const receiver = await prisma.user.findUnique({
        where: {
            email: to
        }
    })
    if(!receiver?.friendRequestsReceived.includes(from)){
        await prisma.user.update({
            where: {
                email: to,
            },
            data: {
                friendRequestsReceived: {
                    push: from
                }
            }
        })
    }
}

export async function acceptFriendRequest(receiver: string, sender: string) {

    const userSender = await prisma.user.findUnique({
        where: {
            email: sender
        }
    })
    const sentRequests = userSender?.friendRequestsSent;
    const updateSentRequests = sentRequests?.filter(id => id !== receiver);
    await prisma.user.update({
        where: {
            email: sender
        },
        data: {
            friendRequestsSent: updateSentRequests,
            friends: {
                connect: { email: receiver }
            }
        }
    })

    const userReceiver = await prisma.user.findUnique({
        where: {
            email: receiver
        }
    })
    const receivedRequests = userReceiver?.friendRequestsSent;
    const updateReceivedRequests = receivedRequests?.filter(id => id !== sender);
    await prisma.user.update({
        where: {
            email: receiver
        },
        data: {
            friendRequestsReceived: updateReceivedRequests,
            friends: {
                connect: { email: sender }
            }
        }
    })

    const chatID = createChat(receiver, sender);

    return {chatID, senderImage: userSender?.image, receiverImage: userReceiver?.image};
}

export async function createChat(user1: string, user2: string) {
    const chat = await prisma.chat.create({});
    await prisma.usersOnChats.create({
        data: {
            userEmail: user1,
            chatID: chat.id
        }
    })
    await prisma.usersOnChats.create({
        data: {
            userEmail: user2,
            chatID: chat.id
        }
    })
    return chat.id;
}

export async function addMessageToDB(from: string, to: string, message: string, chatID: bigint, delivered: boolean) {
    await prisma.message.create({
        data: {
            sender: from,
            receiver: to,
            message,
            chatId: chatID,
            status: delivered ? "DELIVERED" : "UNDELIVERED"
        }
    })
}