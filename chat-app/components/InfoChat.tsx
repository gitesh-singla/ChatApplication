import React from 'react'

function InfoChat({className} : {className: string}) {
    return (
        <div className={className + " " + "max-h-full h-full flex flex-col min-w-0 bg-stone-900 gap-8 p-8"}>
            <h1 className='text-4xl font-bold text-center'>Select a chat to get started</h1>
            <h2 className='text-xl text-justify'><span className='text-rose'>Note: </span>Do not use any personal or sensitive information while trying out the apllication. 
            The messages are not encrypted and are stored as plain text.</h2>
            <h2 className='text-xl'><span className='text-rose'>Github: </span> <a className="hover:opacity-80 hover:underline" href="https://github.com/gitesh-singla/">Gitesh Singla</a></h2>
        </div>
    )
}

export default InfoChat