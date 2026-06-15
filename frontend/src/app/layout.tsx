import { ClerkProvider, UserButton, SignInButton } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from '@clerk/nextjs/server';
import { ThemeProvider } from "@/components/theme-provider";
import { WeeklyWrap } from "@/components/weekly-wrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoTrack | Carbon Management",
  description: "AI-powered carbon tracking and offset marketplace.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 w-full overflow-hidden">
                  <header className="flex h-16 items-center border-b px-4 w-full bg-background justify-between">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger />
                      <h2 className="font-semibold text-lg text-foreground">Welcome back!</h2>
                      <WeeklyWrap />
                    </div>
                    <div>
                      {userId ? <UserButton /> : <SignInButton />}
                    </div>
                  </header>
                  <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/50">
                    {children}
                  </main>
                </div>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
