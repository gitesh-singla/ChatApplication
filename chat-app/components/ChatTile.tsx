import { Dispatch, SetStateAction } from "react";

export default function ChatTile({ chatData, setActiveChat }: { chatData: Chat, setActiveChat: Dispatch<SetStateAction<string>> }) {
    return (
        <div className='flex gap-4 border-b py-4 px-2 border-stone-700 max-w-full cursor-pointer hover:opacity-80'
            onClick={() => setActiveChat(chatData.recipient)}>
            <img src={chatData.image || "/userLogo.svg"} className='w-8 rounded-full' />
            <div className='flex-1'>
                <div className=''>{chatData.recipient}</div>
                <div className='text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-72'>{chatData.messages[chatData.messages.length - 1]?.message}</div>
            </div>
        </div>
    )
}