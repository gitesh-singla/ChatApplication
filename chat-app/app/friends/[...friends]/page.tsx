"use client"

import { searchUsers } from '@/app/actions/actions';
import AddFriends from '@/components/AddFriends';
import FriendRequests from '@/components/FriendRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useChatData } from '@/contexts/ChatDataContext';
import { useSocket } from '@/contexts/SocketContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'


function FriendsPage() {
  const pathname = usePathname();
  const activeLink = 'bg-rose text-light '

  const session = useSession();

  if (session.status == "unauthenticated") {
    redirect("/")
  }

  return (
    <div className='flex items-stretch w-full h-full'>
      <div className='w-80'>
        <Link className='text-xl font-semibold text-rose block pl-4 h-16 leading-[4rem] border-b-2 border-rose' href={'/'}>Chat</Link>
        <div className='flex flex-col'>
          <Link className={`${pathname == '/friends/addfriend' ? activeLink : ''} text-lg p-2`} href={'/friends/addfriend'}>Add Freind</Link>
          <Link className={`${pathname == '/friends/friendrequests' ? activeLink : ''} text-lg p-2`} href={'/friends/friendrequests'}>Friend Requests</Link>
        </div>
      </div>
      <div className='flex-1 bg-stone-900 max-w-[calc(100%-320px)]'>
        {pathname == "/friends/addfriend" && <AddFriends />}
        {pathname == "/friends/friendrequests" && <FriendRequests />}
      </div>
    </div>
  )
}

export default FriendsPage 