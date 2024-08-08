import prisma from "../prisma/db";

export async function getChatID (user1: string, user2: string) {
    const result = await prisma.usersOnChats.groupBy({
        by: ['chatID'],
        where: {
            userEmail: {
                in: [user1, user2],
            }
        },
        having: {
            chatID: {
                _count: {
                    gt: 2,
                }
            }
        }
    })
    if(!result || !result[0].chatID) throw "Error finding ChatID"
    return result[0].chatID;
}