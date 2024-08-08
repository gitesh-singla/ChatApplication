"use client"

import { useChatData } from "@/contexts/ChatDataContext";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useSocket } from "@/contexts/SocketContext";
import { Button } from "./ui/button";


export default function FriendRequests() {
    const { receivedRequests, sentRequests} = useChatData();
    const [menu, setMenu] = useState<string>("received");
    const { socket, socketIsLoading } = useSocket();
    const { toast } = useToast();
  
    const active = " bg-stone-900 text-rose"
    const inactive = " hover:opacity-80"
  
    function acceptFriendRequestWS(friend: string) {
      if (socketIsLoading) {
        toast({
          title: "Connection error!",
          description: "Socket unavailable."
        })
      }
      const toSend = {
        type: "f_a",
        from: friend,
      }
  
      socket?.send(JSON.stringify(toSend));
    }
  
    return (
      <main className='w-full'>
        <div className='bg-black flex justify-start items-center '>
          <div className={`text-lg p-4 ${menu == "received" ? active : inactive}`} onClick={() => setMenu("received")}>Received Requests</div>
          <div className={`text-lg p-4 ${menu == "sent" ? active : inactive}`} onClick={() => setMenu("sent")}>Sent Requests</div>
        </div>
  
        {menu == "received" && <div className='pb-8 overflow-y-auto max-h-[calc(100% - 200px)]'>
          {receivedRequests && receivedRequests.map(res => {
            return (
              <div key={res} className='p-2 px-4 min-w-0 flex justify-between items-center hover:bg-stone-800 hover:opacity-80'>
                <div className='overflow-hidden text-ellipsis'>{res}</div>
                <Button onClick={() => acceptFriendRequestWS(res)}>Accept</Button>
              </div>
            )
          })}
        </div>}
  
        {menu == "sent" && <div className=' p-8 overflow-y-auto max-h-[calc(100% - 200px)]'>
          {sentRequests && sentRequests.map(res => {
            return (
              <div key={res} className='overflow-hidden text-ellipsis p-2 min-w-0 hover:bg-stone-800 hover:opacity-80'>
                {res}
              </div>
            )
          })}
        </div>}
      </main>
    )
  }