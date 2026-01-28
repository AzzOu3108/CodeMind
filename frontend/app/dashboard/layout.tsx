import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
