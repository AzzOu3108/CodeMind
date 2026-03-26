import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
      <SidebarTrigger className="hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 transition-colors duration-200" />
      <Separator orientation="vertical" className="mx-2 h-4 bg-gray-200" />
      <Link
        href="/dashboard"
        className="font-light text-gray-600 hover:text-primary transition-colors duration-300"
      >
        CodeMind
      </Link>
    </header>
  );
}