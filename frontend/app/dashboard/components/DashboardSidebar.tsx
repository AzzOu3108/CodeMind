"use client"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import Link from "next/link"

export default function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <nav className="space-y-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/courses">Courses</Link>
          <Link href="/dashboard/profile">Profile</Link>
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
