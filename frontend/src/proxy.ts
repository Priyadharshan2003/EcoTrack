import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/demo", "/api/(.*)", "/login(.*)", "/signup(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next();
});

export default async function middleware(req: any, event: any) {
  try {
    return await clerk(req, event);
  } catch (err: any) {
    // If there's a JWK kid mismatch (stale cookie from another project on localhost),
    // we return a foolproof script that wipes all cookies from the browser directly and reloads.
    if (err.message?.includes('jwk-kid-mismatch') || err.message?.includes('Handshake token verification failed')) {
      return new NextResponse(
        `<html><body><script>
          document.cookie = "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "__client_uat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/";
        </script></body></html>`,
        { headers: { 'content-type': 'text/html' } }
      );
    }
    throw err;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
