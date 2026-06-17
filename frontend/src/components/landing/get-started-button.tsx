"use client";

import { useUser, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GetStartedButton({ 
  className, 
  variant = "default",
  text = "Start Tracking Free" 
}: { 
  className?: string, 
  variant?: "default" | "outline" | "ghost",
  text?: string 
}) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const buttonContent = (
    <Button 
      size="lg" 
      variant={variant}
      onClick={isSignedIn ? () => router.push("/dashboard") : undefined}
      className={`relative group overflow-hidden ${className}`}
      aria-label={text}
    >
      {isSignedIn ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
          <span className="relative z-10 flex items-center gap-2">{text}</span>
        </>
      ) : (
        <span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
          <span className="relative z-10 flex items-center gap-2">{text}</span>
        </span>
      )}
    </Button>
  );

  if (!isLoaded || isSignedIn) return buttonContent;

  return (
    <SignUpButton forceRedirectUrl="/dashboard">
      {buttonContent}
    </SignUpButton>
  );
}
