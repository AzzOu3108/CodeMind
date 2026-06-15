import { HeadCircuitIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link';
import React from 'react'

export default function AuthCard({
    title,
    children,
    inline
}: {
    title: string;
    children: React.ReactNode;
    inline?: boolean
}
) {
  return (
    <div className="flex flex-col items-center justify-start bg-white border-purple-300 border-2 backdrop-blur-md shadow-lg py-5 px-18 rounded-4xl w-[500px]">
        <div className="flex flex-col items-center mt-0 mb-2">
            <div className="text-[28px] 2xl:text-[35px] hover:scale-125 transition-all ease-out duration-300">
                <Link href={'/'}>
                <HeadCircuitIcon />
                </Link>
            </div>
            <h2 className="mt-0 text-2xl font-bold text-center">
                {title}{" "}{inline ? " " : <br />}to
                Code<span className='text-primary'>Mind</span>
            </h2>
        </div>

        <div className='w-full'>
            {children}
        </div>
    </div>
  )
}
