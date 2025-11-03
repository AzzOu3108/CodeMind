import { HeadCircuitIcon } from '@phosphor-icons/react/ssr'
import React from 'react'

export default function AuthCard({
    title,
    children
}: {
    title: string;
    children: React.ReactNode
}
) {
  return (
    <div className="flex flex-col items-center justify-start bg-white backdrop-blur-md shadow-lg py-5 px-18 rounded-2xl w-[500px] min-h-[500px]">
        <div className="flex flex-col items-center mt-2 mb-6">
            <div className="text-[35px] 2xl:text-[45px]">
                <HeadCircuitIcon />
            </div>
            <h2 className="mt-2 text-xl font-semibold">
                {title}{" "}
                Code<span className='text-primary'>Mind</span>
            </h2>
        </div>

        <div className='w-full'>
            {children}
        </div>
    </div>
  )
}
