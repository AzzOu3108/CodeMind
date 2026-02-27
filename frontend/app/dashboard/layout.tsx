import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/DashboardSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <SidebarTrigger className="hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 transition-colors duration-200"/>  
        </header>
      <main className="flex flex-1 flex-col gap-4 p-6">
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

//  <SidebarProvider>
//       <DashboardSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//           <SidebarTrigger className="hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 transition-colors duration-200" />
//           <div className="flex items-center gap-2">
//             <h1 className="text-lg font-semibold">AI E-Learning Platform</h1>
//           </div>
//         </header>
//         <main className="flex flex-1 flex-col gap-4 p-4">
//           {children}
//         </main>
//       </SidebarInset>
//     </SidebarProvider>