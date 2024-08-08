import { createServer, IncomingMessage } from "http"
import url from "url";
import { WebSocketServer } from "ws";
import { verifyChatToken } from "./lib/ChatToken";
import { connectedClientsType, WebSocketExt } from "./types";
import { onMessageEvent } from "./lib/SocketEvents";
import envs from "./config";

export const connectedClients: connectedClientsType = {};

const server = createServer();

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
    try {
        if (!req.url) throw "Invalid request";
        
        const parsedURL = url.parse(req.url, true).query

        const { chatToken } = parsedURL
        
        if (!chatToken || typeof chatToken != "string") throw "Invalid chat token";

        const email = verifyChatToken(chatToken)

        wss.handleUpgrade(req, socket, head, (ws, req) => {
            wss.emit('connection', ws, req, email)
        })
    } catch (error) {
        console.log(error);
        socket.destroy();
    }
})

wss.on('connection', (ws: WebSocketExt, req: IncomingMessage, email: string) => {
    connectedClients[email!] = ws;
    ws.clientEmail = email;
    console.log("client connected: ", email);

    ws.on('message', (data, isBinary) => onMessageEvent(data, isBinary, ws))

    ws.on('close', () => {
        console.log('Client disconnected:', email);
        delete connectedClients[email];
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        ws.send(`Error: ${err.toString()}`);
    });
})

server.listen(envs.PORT)