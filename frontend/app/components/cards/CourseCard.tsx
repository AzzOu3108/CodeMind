"use client"

import { MoreVertical, Play, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import type { Course } from '@/types/user'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteCourse } from '@/lib/api'
import { toast } from 'sonner'

const DIFFICULTY_STYLES: Record<Course['difficulty'], { bg: string; text: string; label: string }> = {
  beginner:     { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', label: 'Beginner' },
  intermediate: { bg: 'bg-[#FEF9C3]', text: 'text-[#CA8A04]', label: 'Intermediate' },
  advanced:     { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', label: 'Advanced' },
}

export default function CourseCard({ course, onDelete }: { course: Course; onDelete: (id: number) => void }) {
  const level = DIFFICULTY_STYLES[course.difficulty]
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    // Remove from local state immediately for instant UX
    onDelete(course.id)
    setDeleteDialogOpen(false)
    // Then try the API in the background
    try {
      await deleteCourse(course.id)
      toast.success('Course deleted successfully')
    } catch {
      toast.error('Failed to delete course')
    }
  }

  return (
    <>
      <div className="group relative rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3 shadow-[0_0_8px_2px_rgba(139,92,246,0.08)] hover:shadow-[0_0_12px_3px_rgba(139,92,246,0.18)] transition-all duration-500 ease-in-out">
        {/* Three-dot menu — visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Course options"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="min-w-[160px] bg-white">
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2 !text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <p className="font-bold text-lg line-clamp-1">{course.title}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">{course.description}</p>

        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
          {/* Level pill */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${level.bg} ${level.text}`}>
            {level.label}
          </span>

          {/* Chapters pill */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {course.chapiter_count} {course.chapiter_count === 1 ? 'chapter' : 'chapters'}
          </span>

          {/* Video pill */}
          {course.include_video && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
              <Play className="w-3 h-3 fill-blue-600" />
              Video
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        {/* Continue Learning button */}
        <button className="w-full mt-1 rounded-lg bg-primary text-white font-semibold text-sm py-2 hover:bg-primary/20 transition-colors cursor-pointer">
          Continue Learning
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent hideClose className="sm:max-w-[425px] bg-white dark:bg-white duration-300 border-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Course</DialogTitle>
            <DialogDescription className="text-sm text-gray-900 pt-1">
              Are you sure you want to delete <span className="font-semibold text-gray-900">&ldquo;{course.title}&rdquo;</span>?
              This action cannot be undone and all your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end pt-2">
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
