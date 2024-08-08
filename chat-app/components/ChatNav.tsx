"use client"

import { useChatData } from '@/contexts/ChatDataContext';
import { CustomSession } from '@/lib/sessionUtils';
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import ChatTile from './ChatTile';



function ChatNav({ className, session }: { className: string, session: CustomSession }) {

    const userImage = session.user?.image

    const chatDataContext = useChatData();
    const [searchInput, setSearchInput] = useState<string>("");
    const [filteredChats, setFilteredChats] = useState<ChatObject>({})

    const { activeChat, setActiveChat } = chatDataContext;

    useEffect(() => {
        setSearchInput("");
        if (chatDataContext.chats) setFilteredChats(chatDataContext.chats)
    }, [chatDataContext.chats])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilteredChats((prev) => {
                if (!chatDataContext.chats) return prev;
    
                const newChats = {...chatDataContext.chats};
    
                Object.keys(chatDataContext.chats)
                    .filter(key => !key.includes(searchInput.trim()))
                    .forEach(key => delete newChats[key]);
    
                return newChats;
            })
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchInput])

    return (
        <div className={className + " " + "flex flex-col max-h-full"}>
            <div className='flex justify-between p-4 h-16 items-center border-b-2 border-rose'>
                <img src={userImage || "/userLogo.svg"} alt="" className='w-8 rounded-full' />
                <div className='flex gap-4'>
                    <Link href={"/friends/addfriend"} className='hover:opacity-80'><img src="/friends.svg" className='w-6' /></Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='hover:opacity-80'>
                            <div className='flex flex-col gap-1 justify-center w-8 items-center rounded-full '>
                                <div className='bg-gray-600 w-1 h-1'></div>
                                <div className='bg-gray-600 w-1 h-1'></div>
                                <div className='bg-gray-600 w-1 h-1'></div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='dark'>
                            <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className='search-chat flex gap-2 p-4 border-b-2 border-gray-800'>
                <Input className='dark' placeholder='search chats...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                {/* <img src="/cross.svg" alt="x" className='w-4' /> */}
                <Button className='rounded-full' onClick={() => setSearchInput("")}>X</Button>
            </div>
            <div className='flex flex-col overflow-y-auto flex-1 max-h-[calc(100%-138px)]'>
                {filteredChats && Object.entries(filteredChats).map(([key, value]) => <ChatTile key={key} chatData={value} setActiveChat={setActiveChat} />)}
            </div>
        </div>
    )
}

export default ChatNav