"use client"
import AuthInputs from '@/app/components/ui/AuthInputs'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function ResetPassForm() {

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    try {
      const response = await fetch("", { // TODO: reset password endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Invalid password. Please try again.")
      } else {
        toast.success("Password changed successfully. Login again.")
        setFormData({ password: "", confirmPassword: "" })
      }

    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>

      <div className='relative w-full'>
        <AuthInputs
          label='Password'
          type={showPassword ? "text" : "password"}
          id='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-[73%] -translate-y-1/2 text-gray-500 hover:text-gray-700'
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className='relative w-full'>
        <AuthInputs
          label='Confirm your password'
          type={showConfirmPassword ? "text" : "password"}
          id='confirmPassword'
          name='confirmPassword'
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type='button'
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className='absolute right-3 top-[73%] -translate-y-1/2 text-gray-500 hover:text-gray-700'
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        className="mt-3 w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Reset password
      </button>

      <Link
        href="/auth/login"
        className='text-center text-gray-600 hover:text-gray-700 transition-colors font-medium'
      >
        Back to login
      </Link>

    </form>
  )
}
