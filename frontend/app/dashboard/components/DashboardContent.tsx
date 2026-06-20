'use client'

import Link from 'next/link';
import { getCurrentUser, getCourses } from '@/lib/api';
import { CurrentUser, Course } from '@/types/user';
import React, { useEffect, useState } from 'react'
import TotalCourses from '../../components/cards/StatusCards/TotalCourses';
import InProgress from '../../components/cards/StatusCards/InProgress';
import Completed from '../../components/cards/StatusCards/Completed';
import CourseCard from '../../components/cards/CourseCard';
import { BookOpen, Sparkles } from 'lucide-react';

function isFirstVisit(create_at: string){
  const created = new Date(create_at).getTime();
  const now = Date.now()
  const diffInMinutes = (now - created) /1000 /60
  return diffInMinutes < 5
}

export default function DashboardContent() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCurrentUser(),
      getCourses().catch(() => [] as Course[]),
    ]).then(([userData, courseData]) => {
      if (userData) setUser(userData as unknown as CurrentUser)
      setCourses(courseData) // No hardcoded fallback — courses come from API only
      setLoading(false)
    })
  }, [])

  const firstVisit = user ? isFirstVisit(user.create_at) : false

  const greeting = loading
    ? null
    : firstVisit
    ? "Welcome to CodeMind!"
    : `Welcome back, ${user?.name?.split(" ")[0]}!`

  const subtext = loading
    ? null
    : firstVisit
    ? "We're glad to have you. Let's start your learning journey."
    : "Continue your learning journey with CodeMind.";

  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {loading ? (
            <div className="h-9 w-48 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
          )}
          {loading ? (
            <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-gray-100" />
          ) : (
            <p className="text-muted-foreground mt-1 text-sm text-gray-500">{subtext}</p>
          )}
        </div>
        {/* Top‑right CTA — only when courses exist */}
        {courses.length > 0 && (
          <Link
            href="/dashboard/createCourse"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_3px_rgba(139,92,246,0.3)]"
          >
            + Create Course
          </Link>
        )}
      </div>

      {/* Empty State — centered CTA when no courses */}
      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-4 animate-in fade-in-0 duration-500">
          <div className="rounded-full bg-violet-100 p-5 mb-6">
            <BookOpen className="h-12 w-12 text-violet-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No courses yet</h2>
          <p className="text-gray-500 text-center max-w-md mb-8 leading-relaxed">
            Create your first course and start learning with AI-powered<br />
            guidance tailored just for you.
          </p>
          <Link
            href="/dashboard/createCourse"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-white shadow-lg hover:opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_5px_rgba(139,92,246,0.3)]"
          >
            <Sparkles className="h-5 w-5" /> Create a Course
          </Link>
        </div>
      )}

      {/* Courses Content — only when courses exist */}
      {courses.length > 0 && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TotalCourses count={courses.length} />
            <InProgress count={2} />
            <Completed count={0} />
          </div>

          {/* Your Courses */}
          <div className="flex flex-col gap-4">
            <p className='font-semibold text-xl'>Your Courses</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onDelete={(id) => setCourses(prev => prev.filter(c => c.id !== id))} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}