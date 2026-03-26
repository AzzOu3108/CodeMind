import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/DashboardSidebar"
import DashboardHeader from "./components/DashboardHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}