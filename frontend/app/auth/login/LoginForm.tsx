"use client"

import Image from "next/image"
import AuthInputs from "@/app/components/ui/AuthInputs"
import Button from "@/app/components/ui/Button"
import { apiFetch } from "@/lib/api"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
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

      <div className="flex items-center justify-between w-full">
        <Link href="/auth/forget-password" className="text-sm font-medium text-gray-500 select-none hover:text-gray-700 transition-colors">
          Forget your password?
        </Link>

        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-500 select-none cursor-pointer">
          Remember me
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
        </label>
      </div>

      <Button
        type="submit"
        className="shadow-md font-semibold py-0 text-xl"
      >
        Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-sm text-gray-400 whitespace-nowrap">or continue with</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Social buttons — circular icons */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)}
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Continue with Google"
        >
          <Image src="/assets/google.svg" alt="Google" width={22} height={22} />
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`)}
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Continue with GitHub"
        >
          <Image src="/assets/github-142-svgrepo-com.svg" alt="GitHub" width={22} height={22} />
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`)}
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Continue with Apple"
        >
          <Image src="/assets/apple-logo-svgrepo-com.svg" alt="Apple" width={22} height={22} />
        </button>
      </div>

      <p className="text-sm text-center text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}
