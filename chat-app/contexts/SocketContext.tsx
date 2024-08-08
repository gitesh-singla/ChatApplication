"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useChatData } from "./ChatDataContext";
import { handleMessage } from "@/lib/SocketHandlers";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/sessionUtils";

const SocketContext = createContext<{ socket: WebSocket | undefined, socketIsLoading: boolean } | undefined>(undefined);

export function SocketContextProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket>();
    const [socketIsLoading, setSocketIsLoading] = useState<boolean>(true);
    const chatDataContext = useChatData();
    const { data } = useSession();
    const session: CustomSession = data as CustomSession;
    const websocketConnectionRef = useRef<WebSocket | undefined>(undefined);

    useEffect(() => {
        const connectWebSocket = () => {
            
            if (!session || !session.chatToken) return;

            const websocketURL = `ws://localhost:8080/?chatToken=${session.chatToken}`;
            
            if (websocketConnectionRef.current) return;

            const websocketConnection = new WebSocket(websocketURL);

            websocketConnection.onopen = () => {
                console.log("WebSocket connection opened");
                setSocket(websocketConnection);
                setSocketIsLoading(false);
                websocketConnectionRef.current = websocketConnection;
            };

            websocketConnection.onmessage = (event) => {
                handleMessage(event.data, chatDataContext, session);
            };

            websocketConnection.onclose = () => {
                console.log("WebSocket connection closed");
                setSocket(undefined);
                setSocketIsLoading(true);
                websocketConnectionRef.current = undefined;
            };

            websocketConnection.onerror = (error) => {
                console.error("WebSocket error:", error);
                setSocket(undefined);
                setSocketIsLoading(true);
                websocketConnectionRef.current = undefined;
            };
        };

        connectWebSocket();

        const interval = setInterval(() => {
            if (!websocketConnectionRef.current) {
                connectWebSocket();
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            if (websocketConnectionRef.current) {
                websocketConnectionRef.current.close();
                websocketConnectionRef.current = undefined;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, socketIsLoading }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) throw new Error("context unavailable");
    const { socket, socketIsLoading } = context;
    return { socket, socketIsLoading };
}
