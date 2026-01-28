"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import AuthInputs from "@/app/components/ui/AuthInputs"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export default function SignupForm() {
 const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
  rememberMe: false,
})

const [showPassword, setShowPassword] = useState(false)

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, type, checked, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }))
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    await apiFetch("/user", {
      method: "POST",
      body: JSON.stringify({
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password,
      }),
    })

    toast.success("Signup successful!")

    setFormData({
      fullName: "",
      email: "",
      password: "",
      rememberMe: false,
    })
  } catch (err: any) {
    toast.error(err.message || "Signup failed. Please try again.")
  }
}


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <AuthInputs
        label="Full name"
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

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

      <div className="flex items-end justify-end mr-3 space-x-2">
        <label
          htmlFor="rememberMe"
          className="font-medium text-gray-500 text-sm select-none cursor-pointer translate-y-0.5"
        >
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

      <div>
        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)}
          className="mt-5 flex items-center justify-center space-x-2 w-full border-2 rounded-md py-2 cursor-pointer"
        >
          <Image src="/assets/google.svg" alt="google" width={20} height={20} />
          <span className="font-semibold">Sign Up with Google</span>
        </button>
      </div>

      <p className="text-sm text-center text-gray-400">
        Already have an account!{" "}
        <Link href="/auth/login" className="text-primary font-medium">
          login
        </Link>
      </p>
    </form>
  )
}
