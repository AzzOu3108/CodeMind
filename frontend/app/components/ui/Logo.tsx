import { HeadCircuitIcon } from '@phosphor-icons/react'
import React from 'react'


interface LogoProps{
    collapsed ?: boolean,
    className ?: string
}
export default function Logo({ collapsed = false, className}: LogoProps) {
  return (
   <div className={`flex md:flex-row items-center ${className}`}>
        <div className="text-[35px] 2xl:text-[45px]">
          <HeadCircuitIcon  />
        </div>
        {!collapsed && (
        <h1 className="font-bold text-xl pt-2 2xl:text-2xl">
          Code<span className="text-primary">Mind</span>
        </h1>
        )}
      </div>
  )
}
