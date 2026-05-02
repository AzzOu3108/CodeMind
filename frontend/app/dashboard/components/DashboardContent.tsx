'use client'

import { getCurrentUser } from '@/lib/api';
import { CurrentUser } from '@/types/user';
import React, { useEffect, useState } from 'react'
import TotalCourses from '../../components/cards/StatusCards/TotalCourses';
import InProgress from '../../components/cards/StatusCards/InProgress';
import Completed from '../../components/cards/StatusCards/Completed';

function isFirstVisit(create_at: string){
  const created = new Date(create_at).getTime();
  const now = Date.now()
  const diffInMinutes = (now - created) /1000 /60
  return diffInMinutes < 5
}

export default function DashboardContent() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    getCurrentUser().then((data)=>{
      if(data) setUser(data as unknown as CurrentUser);
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
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_10px_3px_rgba(139,92,246,0.3)]">
          + Create Course
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TotalCourses count={3} />
        <InProgress count={2} />
        <Completed count={0} />
      </div>

    </div>
  );
}