import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { WeeklyWrap } from "@/components/weekly-wrap";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="flex h-16 items-center border-b px-4 w-full bg-background justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="font-semibold text-lg text-foreground">Welcome back!</h2>
            <WeeklyWrap />
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
