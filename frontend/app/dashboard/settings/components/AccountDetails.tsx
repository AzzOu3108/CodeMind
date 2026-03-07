'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-green-500",
    "bg-red-500", "bg-yellow-500", "bg-pink-500",
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

export default function AccountDetails() {
  const [fullName, setFullName] = useState("John Doe")
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarSrc(url)
    }
  }

  return (
    <Card className="max-w-2xl border-gray-200">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription className="text-gray-600">
          Update your personal information.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarSrc ?? undefined} />
            <AvatarFallback className={`${getAvatarColor(fullName)} text-white text-xl`}>
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          <Button
            variant="outline"
            className="gap-2 border-gray-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Change Avatar
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="focus-visible:ring-primary border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            defaultValue="john@example.com"
            className="focus-visible:ring-primary border-gray-200"
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button className="text-white">Save Changes</Button>
      </CardFooter>
    </Card>
  )
}