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
         className='w-full border-2 border-gray-300 font-medium text-sm text-gray-700 rounded-full px-3 py-5 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all'/>
    </div>
  )
}
