"use client"

import AuthInputs from "@/app/components/ui/AuthInputs"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { toast } from "sonner"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.message || "Login failed. Please try again.")
        return
      }
 
      const data = await response.json()
      console.log("LOGIN RESPONSE:", data)

      toast.success("Login successful!")
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col translate-y-7 gap-4 w-full max-w-md">
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
