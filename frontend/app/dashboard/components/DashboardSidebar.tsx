"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, BookOpen, Plus, ChevronUp, Settings, LogOut } from "lucide-react";
import Logo from "@/app/components/ui/Logo";
import { apiFetch, getCurrentUser } from "@/lib/api";
import { useEffect, useState } from "react";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "My Courses", icon: BookOpen, url: "/dashboard/courses" },
  { title: "Create Course", icon: Plus, url: "/dashboard/createCourse" },
];

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardSidebarProps {
  user?: UserData;
  onLogout?: () => void;
}

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
    const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    avatar: "",
  });
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser()
        if (user) {
          setUserData({
            name: user.name || "", 
            email: user.email || "",
            avatar: user.avatar || "",
          })
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await apiFetch('/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        window.location.href = '/auth/login'; 
      }
    }
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="bg-[#faf9ff] transition-all duration-300 border-r border-gray-300"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-gray-300">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
            size="lg" 
            asChild 
            className="transition-all duration-200 hover:scale-[1.02] hover:bg-purple-50">
              <Link 
                href="/dashboard" 
                className="transition-transform duration-300 hover:scale-105"
              >
                <Logo collapsed={isCollapsed} className=""/>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel className="text-gray-600">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="text-gray-800">
              {menuItems.map((item, index) => (
                <SidebarMenuItem
                  key={item.title}
                  className="animate-slide-in-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 hover:text-purple-700 hover:bg-purple-50 data-[active=true]:bg-purple-50 data-[active=true]:text-purple-700 "
                  > 
                    <Link href={item.url} onClick={()=> setOpenMobile(false)}>
                      <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="border-t border-gray-300">
        <SidebarMenu>
          <SidebarMenuItem className="animate-fade-in-up hover:bg-purple-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 hover:scale-[1.02] focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
                    <AvatarImage 
                      src={userData.avatar || "/placeholder.svg"} 
                      alt={userData.name} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left text-sm leading-tight">
                    <span className="truncate font-semibold group-hover:text-purple-700 transition-colors duration-200">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userData.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 transition-transform duration-200" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-60 animate-scale-in bg-white border-gray-200"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild className="group transition-colors duration-200 hover:bg-purple-50">
                  <Link href="/dashboard/settings" onClick={()=> setOpenMobile(false)}
                  className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="group-hover:text-purple-800 transition-colors duration-200">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200"/>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive  hover:bg-purple-50 transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-red-600 ">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for easy expand/collapse */}
      <SidebarRail />
    </Sidebar>
  );
}