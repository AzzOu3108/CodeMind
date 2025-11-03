"use client"
import { Input } from "@/components/ui/input"
import React, { useState } from 'react'

export default function SignupForm() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" })
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("", { // TODO: endpoint here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Signup failed. Please try again.");
      } else {
        setMessage("Signup successful!");
        setFormData({ fullName: "", email: "", password: "" });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      {message && <div className="text-green-600 font-medium">{message}</div>}
      {error && <div className="text-red-600 font-medium">{error}</div>}
     <div className="flex flex-col w-full space-y-4">
     <label htmlFor="fullName" className="pl-3 font-medium mb-1">
      Full Name
     </label>
      <Input
      id="fullName"
      name="fullName"
      value={formData.fullName}
      onChange={handleChange}
      placeholder="John Doe"
      required
      className="w-full border-2 border-black font-medium text-sm text-gray-500 rounded-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
      />

      <label htmlFor="email" className="pl-3 font-medium mb-1">
      Email
     </label>
      <Input
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="JhonDoe@gmail.com"
      required
      className="w-full border-2 border-black font-medium text-sm text-gray-500 rounded-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
      />

      <label htmlFor="password" className="pl-3 font-medium mb-1">
      Password
     </label>
      <Input
      id="password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="password123"
      required
      className="w-full border-2 border-black font-medium text-sm text-gray-500 rounded-md px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
      />
      </div>

      
    </form>

  )
}
