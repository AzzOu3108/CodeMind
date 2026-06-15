"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import AuthInputs from "@/app/components/ui/AuthInputs"
import Button from "@/app/components/ui/Button"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function SignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please fill in your name and email.")
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.")
      return
    }

    try {
      await apiFetch("/user", {
        method: "POST",
        body: JSON.stringify({
          fullname: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })

      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      
      toast.success("Signup successful!")

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setStep(1)
      router.push("/dashboard")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Signup failed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
      {/* Step 1: Name & Email */}
      {step === 1 && (
        <>
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

          <Button
            type="button"
            onClick={handleNext}
            className="w-full shadow-md font-bold py-0 text-xl mt-1"
          >
            Next &rarr;
          </Button>
        </>
      )}

      {/* Step 2: Password & Confirm */}
      {step === 2 && (
        <>
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

            {/* Password length hint */}
            {formData.password && formData.password.length < 6 && (
              <p className="text-xs text-red-500 mt-1">Minimum 6 characters required</p>
            )}
          </div>

          <div className="relative w-full">
            <AuthInputs
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-3 top-[74%] -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border-2 border-primary rounded-full py-0 font-bold text-xl text-primary bg-white hover:bg-primary/5 transition-colors cursor-pointer"
            >
              &larr; Back
            </button>
            <Button
              type="submit"
              className="flex-1 shadow-md font-bold py-0 text-xl"
            >
              Sign Up
            </Button>
          </div>
        </>
      )}

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
        Already have an account!{" "}
        <Link href="/auth/login" className="text-primary font-medium">
          login
        </Link>
      </p>
    </form>
  )
}
