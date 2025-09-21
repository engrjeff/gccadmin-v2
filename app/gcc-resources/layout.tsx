import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { GCCResourcesTabs } from "@/features/gcc-resources/gcc-resources-tabs";
import { app } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    absolute: "GCC Resources",
  },
  description: "Publicly accessible GCC Resources.",
};

function GCCResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container max-w-5xl mx-auto ">
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
      </header>
      <main className="py-6 px-4 max-w-5xl mx-auto space-y-4">
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
