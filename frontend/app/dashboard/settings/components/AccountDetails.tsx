'use client'

import { useState, useRef, useCallback } from "react"
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

// ── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-green-500",
    "bg-red-500",    "bg-yellow-500", "bg-pink-500",
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

// Draws the cropped area onto a canvas and returns a blob URL
function cropImageToBlob(
  image: HTMLImageElement,
  crop: PixelCrop,
  outputSize = 200
): Promise<string> {
  const canvas = document.createElement("canvas")
  canvas.width  = outputSize
  canvas.height = outputSize

  const ctx = canvas.getContext("2d")!
  const scaleX = image.naturalWidth  / image.width
  const scaleY = image.naturalHeight / image.height

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width  * scaleX,
    crop.height * scaleY,
    0, 0,
    outputSize,
    outputSize
  )

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/jpeg", 0.95)
  )
}

export default function AccountDetails() {
  const [fullName,   setFullName]   = useState("John Doe")
  const [avatarSrc,  setAvatarSrc]  = useState<string | null>(null)

  // crop modal state
  const [rawSrc,     setRawSrc]     = useState<string | null>(null)   // original file src
  const [crop,       setCrop]       = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [modalOpen,  setModalOpen]  = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setRawSrc(reader.result as string)  // load raw image into modal
      setModalOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ""                   // reset so same file can be re-picked
  }

  // ── image loaded inside modal — default to centered 1:1 crop 
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const initial = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
      width,
      height
    )
    setCrop(initial)
  }, [])

  // user confirms crop 
  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return
    const url = await cropImageToBlob(imgRef.current, completedCrop)
    setAvatarSrc(url)
    setModalOpen(false)
  }

  // render 
  return (
    <>
      <Card className="max-w-2xl border-gray-200">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription className="text-gray-600">
            Update your personal information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar */}
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
              onChange={handleFileChange}
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

          {/* Fields */}
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

      {/* Crop Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop your photo</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-4">
            {rawSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}           // locked to 1:1 → perfect circle
                circularCrop         // shows circular preview overlay
                minWidth={50}
              >
                <img
                  ref={imgRef}
                  src={rawSrc}
                  alt="crop preview"
                  style={{ maxHeight: "60vh", maxWidth: "100%" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!completedCrop}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}