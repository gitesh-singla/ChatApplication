"use client"

import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { searchUsers } from "@/app/actions/actions";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type searchResult = {
    email: string,
    image: string | null
  }

export default function AddFriends() {

    const [searchInput, setSearchInput] = useState<string>("")
    const [searchValue, setSearchValue] = useState<string>("")
    const { socket, socketIsLoading } = useSocket();
    const {toast} = useToast()
    const [searchResults, setSearchResults] = useState<searchResult[]>([]);
  
    function sendFriendRequestWS(friend: string) {
      if (socketIsLoading) {
        toast({
          title: "Connection error!",
          description: "Socket unavailable."
        })
      }
      const toSend = {
        type: "f_s",
        to: friend,
      }
  
      socket?.send(JSON.stringify(toSend));
    }
  
    async function getSearchResults(input: string) {
      const { data } = await searchUsers(input)
      if (!data) throw ("error occured")
      setSearchResults(data);
    }
  
    useEffect(() => {
      const timeout = setTimeout(async () => {
        setSearchValue(searchInput.replace(/\s/g, ''))
      }, 1000)
  
      return () => {
        clearTimeout(timeout)
      }
    }, [searchInput])
  
    useEffect(() => {
      if (searchValue == "") return;
      try {
        getSearchResults(searchValue);
      } catch (error) {
        console.log(error);
      }
    }, [searchValue])
  
    return (
  
      <div className='w-full flex flex-col p-8'>
        <h2 className='text-xl mb-4'>Search Friends</h2>
        <Input className='dark text-light mb-4' value={searchInput} type="text" name="emailSearch"
          id="emailSearch" placeholder='Enter email' onChange={(e) => setSearchInput(e.target.value)} />
        {/* <div>{searchValue}</div> */}
        {searchValue != "" ? (<div className='text-rose text-lg'>Search results: </div>) : (<></>)}
        <div className='max-h-[calc(100%-216px)] overflow-y-auto'>
          {searchResults &&
            searchResults.map(res => {
              return (
                <div key={res.email} className='p-2 min-w-0 flex justify-between items-center hover:bg-stone-800 hover:opacity-80'>
                  <div className='overflow-hidden text-ellipsis'>{res.email}</div>
                  <Button onClick={() => sendFriendRequestWS(res.email)}>Send</Button>
                </div>
              )
            })}
        </div>
        {searchResults.length == 0 && searchValue != "" ? (<div>No reults</div>) : (<></>)}
      </div>
    )
  }