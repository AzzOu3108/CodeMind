"use client"
import AuthInputs from '@/app/components/ui/AuthInputs'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function ForgetPassForm() {
  const [formData, setFormData] = useState({ email: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("", { //TODO: forget password logic
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Invalid email. Please try again.")
      } else {
        toast.success("Check your email to reset your password.")
        setFormData({ email: "" })
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
        <AuthInputs 
        label='Email'
        id='email'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder="JhonDoe@gmail.com"
        required
        />

        <div className='flex flex-col space-y-6'>
        <button
        type="submit"
        className="mt-3 w-full bg-primary text-white font-semibold py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Reset password
      </button>

      <Link href="/auth/login"
      className='text-center text-gray-600 hover:text-gray-700 ease-in-out transition-colors font-medium'
      >
      Back to login
      </Link>
      </div>
    </form>
  )
}
