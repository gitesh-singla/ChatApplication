import { WebSocket } from "ws";

export declare class WebSocketExt extends WebSocket {
    clientEmail: string
}

export type connectedClientsType = {
    [key: string]: WebSocket
}