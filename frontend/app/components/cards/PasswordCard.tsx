import React from 'react'

export default function PasswordCard({
    title,
    text,
    children,
    variant 
}:{
    title: string;
    text: string;
    children: React.ReactNode;
    variant?: "default" | "compact";
}
) {
  return (
    <div className=''>
    <div  className={
        variant === "default"
        ? 'flex flex-col items-start bg-white backdrop-blur-md shadow-lg py-5 px-18 rounded-2xl w-[550px] min-h-[400px]'
        : 'flex flex-col items-start bg-white backdrop-blur-md shadow-lg px-18 rounded-2xl w-[550px] min-h-[460px]'
    }>
        <div className='flex flex-col mt-9 mb-6 space-y-3'>
            <h2 className='text-2xl font-semibold'>{title}</h2>
            <p className='font-normal'>{text}</p>
        </div>
        <div className='w-full'>
            {children}
        </div>
    </div>
    </div>
  )
}
