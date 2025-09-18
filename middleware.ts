import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  const validRole =
    session.sessionClaims?.metadata?.role === "admin" ||
    session.sessionClaims?.metadata?.role === "leader";

  if (validRole) {
    if (req.nextUrl.pathname === "/unauthorized") {
      const url = new URL("/", req.nextUrl);
      return NextResponse.redirect(url);
    }

    const nonAdmin = session.sessionClaims?.metadata?.role !== "admin";

    if (nonAdmin && req.nextUrl.pathname.includes("/leaders")) {
      const url = new URL("/dashboard", req.nextUrl);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const noRole = !session.sessionClaims?.metadata?.role;

  if (noRole && !isPublicRoute(req)) {
    const url = new URL("/unauthorized", req.nextUrl);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
