"use client";

import { motion } from "framer-motion";
import { Leaf, MessageSquare, Settings, LayoutDashboard, Zap, Users, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Track",
    url: "/track",
    icon: Zap,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Users,
  },
  {
    title: "AI Coach",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Offset Market",
    url: "/offsets",
    icon: Leaf,
  },
  {
    title: "Live Map",
    url: "/map",
    icon: Map,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-foreground/5 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3 font-bold text-2xl group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <span className="text-foreground tracking-tight">EcoTrack</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="block w-full">
                      <motion.div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="sidebar-active"
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <item.icon className={`h-5 w-5 z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
                        <span className="font-medium z-10">{item.title}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        )}
                      </motion.div>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="bg-foreground/5 border border-foreground/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">PRO</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">EcoTrack Pro</p>
              <p className="text-xs text-foreground/50">Active Plan</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
