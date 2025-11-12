"use client"

import AuthInputs from '@/app/components/ui/AuthInputs'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const response = await fetch("", { // TODO: login endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Login failed. Please try again.")
      } else {
        setMessage("Login successful!")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col translate-y-7 gap-4 w-full max-w-md">
      {message && <div className="text-green-600 font-medium">{message}</div>}
      {error && <div className="text-red-600 font-medium">{error}</div>}

      <AuthInputs
        label="Email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="JhonDoe@gmail.com"
        required
      />

      <div className="relative w-full">
        <AuthInputs
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="password123"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-[74%] -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="flex items-center justify-between w-full mt-2">
        <Link href="/auth/forget-password" className="text-sm font-medium text-gray-500 select-none">
          Forget your password?
        </Link>
        <div className="flex items-center space-x-2">
          <label htmlFor="rememberMe" className="font-medium text-gray-500 text-sm select-none cursor-pointer">
            Remember me
          </label>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-3 w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Login
      </button>

      <p className="text-sm text-center text-gray-400">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}
