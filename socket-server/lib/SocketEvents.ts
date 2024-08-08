import { connectedClients } from "..";
import { WebSocketExt } from "../types";
import { acceptFriendRequest, addMessageToDB, sendFriendRequest } from "./DBfunctions";

export async function onMessageEvent(data: any, isBinary: boolean, ws: WebSocketExt) {
    try {
        const parsedData = await JSON.parse(data);
        const { type } = parsedData;
        // m = message, s = status, f = friendreq
        switch (type) {
            case "f_s": {
                const { to } = parsedData;
                ws.send(JSON.stringify({
                    status: "success",
                    message: "friend request sent",
                    to,
                    type
                }))
                if(to in connectedClients){
                    connectedClients[to].send(JSON.stringify({
                        status: "success",
                        type: "f_r",
                        message: "friend request received",
                        from: ws.clientEmail,
                    }))
                }
                sendFriendRequest(ws.clientEmail, to);
                break;
            }

            case "f_a": {
                const{from} = parsedData;
                const {chatID, senderImage, receiverImage} = await acceptFriendRequest(ws.clientEmail, from);
                ws.send(JSON.stringify({
                    status: "success",
                    message: chatID.toString(),
                    image: senderImage,
                    from,
                    type
                }))
                if(from in connectedClients){
                    connectedClients[from].send(JSON.stringify({
                        status: "success",
                        message: chatID.toString(),
                        image: receiverImage,
                        from: ws.clientEmail,
                        type
                    }))
                }
                break;
            }

            case "m": {
                const {message, to, chatID} = parsedData;
                let delivered = false;
                if(to in connectedClients){
                    connectedClients[to].send(JSON.stringify({
                        type: "m",
                        from: ws.clientEmail,
                        message,
                        status: "DELIVERED"
                    }))
                    delivered = true;
                }
                addMessageToDB(ws.clientEmail, to, message, chatID, delivered);
            }
        }
    } catch (error) {
        ws.emit('error', "Error Occured");
        console.log(error);
    }
}