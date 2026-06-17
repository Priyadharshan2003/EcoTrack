import { HeroV2 } from "@/components/landing/hero-v2";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GetStartedButton } from "@/components/landing/get-started-button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";

const BentoGridV2 = dynamic(() => import("@/components/landing/bento-grid-v2").then(mod => mod.BentoGridV2));
const DashboardCarouselV2 = dynamic(() => import("@/components/landing/dashboard-carousel-v2").then(mod => mod.DashboardCarouselV2));
const HowItWorksV2 = dynamic(() => import("@/components/landing/how-it-works-v2").then(mod => mod.HowItWorksV2));
const SocialProofV2 = dynamic(() => import("@/components/landing/social-proof-v2").then(mod => mod.SocialProofV2));
const CtaSectionV2 = dynamic(() => import("@/components/landing/cta-section-v2").then(mod => mod.CtaSectionV2));

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-bold text-xl tracking-tight">EcoTrack</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <ThemeSwitcher />
            <SignInButton forceRedirectUrl="/dashboard">
              <button className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </button>
            </SignInButton>
            <GetStartedButton 
              text="Get Started" 
              className="h-9 px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 pt-16">
        <HeroV2 />
        <BentoGridV2 />
        <SocialProofV2 />
        <HowItWorksV2 />
        <DashboardCarouselV2 />
        <CtaSectionV2 />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center opacity-50">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span>© {new Date().getFullYear()} EcoTrack Systems. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
