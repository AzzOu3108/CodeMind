"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// Re-export for API compatibility with existing DangerZone usage
export {
  Dialog as AlertDialog,
  DialogTrigger as AlertDialogTrigger,
  DialogOverlay as AlertDialogOverlay,
  DialogContent as AlertDialogContent,
  DialogHeader as AlertDialogHeader,
  DialogFooter as AlertDialogFooter,
  DialogTitle as AlertDialogTitle,
  DialogDescription as AlertDialogDescription,
}

// Add simple placeholders for action/cancel if needed by consuming code
export const AlertDialogAction = ({ children, ...props }: React.ComponentPropsWithoutRef<'button'>) => (
  <button type="button" {...props}>
    {children}
  </button>
)

export const AlertDialogCancel = ({ children, ...props }: React.ComponentPropsWithoutRef<'button'>) => (
  <button type="button" {...props}>
    {children}
  </button>
)
