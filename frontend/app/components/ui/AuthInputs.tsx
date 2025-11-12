import React from 'react'
import { Input } from '@/components/ui/input'

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}


export default function AuthInputs({label, ...props}: InputWithLabelProps) {
  return (
    <div className='flex flex-col w-full space-y-5'>
        <label htmlFor={props.id} className='pl-3 font-medium mb-1'>{label}</label>
        <Input {...props}
         className='w-full border-2 border-black font-medium text-sm text-gray-500 rounded-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all'/>
    </div>
  )
}
