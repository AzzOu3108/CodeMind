import React from 'react'

interface CardsProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  iconBackground: boolean;
  chart?: React.ReactNode
}

export default function Cards({title, description, icon, className, iconBackground = true, chart}:CardsProps) {
  return (
     <div className={`flex flex-col text-center bg-white p-6 rounded-3xl gap-3 items-center shadow-2xl max-w-6xl mx-auto ${className}`}>
        <div className={
            iconBackground ?
            'px-2 py-2 bg-primary rounded-full text-white'
            : "" // no background
        }>{icon}</div>
        <h1 className='font-semibold '>{title}</h1>
        <p className=''>{description}</p>
        {chart && <div className="w-full">{chart}</div>}
     </div>
  )
}

