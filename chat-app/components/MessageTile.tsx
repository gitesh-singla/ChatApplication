export default function MessageTile({ message, userEmail }: { message: Message, userEmail: string }) {
    const sender = "self-end text-right bg-black text-light"
    const receiver = "self-start text-left bg-rose text-light "

    return (
        <div className={`max-w-[80%] min-w-0 w-fit p-2 rounded break-words ${message.sender == userEmail ? sender : receiver}`}>
            {message.message}
        </div>
    )
}