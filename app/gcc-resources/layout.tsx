import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { GCCResourcesTabs } from "@/features/gcc-resources/gcc-resources-tabs";
import { app } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    absolute: "GCC Resources",
    default: "GCC Resources",
  },
  description: "Publicly accessible GCC Resources.",
  openGraph: {
    title: "GCC Resources",
    images: [
      {
        url: app.resourcesOmageUrl,
        alt: "GCC Resources",
        width: 1200,
        height: 630,
      },
    ],
  },
};

function GCCResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container max-w-5xl mx-auto flex flex-col min-h-screen">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
        <Link href="/" className="flex items-center gap-x-4">
          <Image
            unoptimized
            src="/gcc-logo.svg"
            alt={app.title}
            width={32}
            height={32}
          />
          <span className="font-semibold">Grace City</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <ClerkLoaded>
            <SignedIn>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ClerkLoaded>
        </div>
      </header>
      <main className="py-6 px-4 space-y-4 flex-1 min-h-[90vh]">
        <div>
          <h1 className="font-semibold">Welcome to GCC Resources</h1>
          <p className="text-sm text-muted-foreground">
            A collection of GCC teaching materials.
          </p>
        </div>
        <GCCResourcesTabs />
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default GCCResourcesLayout;
