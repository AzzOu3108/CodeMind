'use client'

import {
  Card, CardHeader, CardTitle,
  CardDescription, CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, TriangleAlert } from "lucide-react"
import { useState } from "react"
import { deleteUser } from "@/lib/api"

export default function DangerZone() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteUser()
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to delete account:", error)
      setIsDeleting(false)
      setOpen(false)
    }
  }

  return (
    <Card className="max-w-2xl border-red-300">
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
        <CardDescription>Irreversible actions for your account.</CardDescription>
      </CardHeader>

      <div className="px-6">
        <Separator className="bg-gray-200" />
      </div>

      <CardContent className="flex items-center justify-between pt-6">
        <div>
          <p className="font-semibold text-sm">Delete Account</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data.
          </p>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shrink-0 ml-4">
              Delete Account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-lg w-full bg-white dark:bg-white rounded-2xl p-6 shadow-xl [color-scheme:light]">
            {/* Header */}
            <AlertDialogHeader className="space-y-2 text-left mb-2">
              <AlertDialogTitle className="text-red-600 dark:text-red-600 text-xl font-bold flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 text-red-600" />
                Delete Account?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-600 text-sm leading-relaxed">
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Red tinted info box */}
            <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 my-4">
              <p className="text-red-600 font-semibold text-sm mb-3">This will delete:</p>
              <ul className="space-y-2">
                {[
                  "Your account and personal information",
                  "All courses you created",
                  "Your progress and learning history",
                  "Any custom content and settings",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirmation text */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-700 mb-4">
              Are you absolutely sure?
            </p>

            {/* Footer buttons */}
            <AlertDialogFooter className="flex gap-3 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 dark:bg-white dark:text-gray-700 dark:border-gray-200 dark:hover:bg-gray-50 text-gray-700 rounded-xl h-11"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}