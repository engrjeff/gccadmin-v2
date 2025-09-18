import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="font-bold text-4xl text-center">
          Welcome to {app.title}!
        </h1>
        <p className="text-lg text-muted-foreground">{app.description}</p>

        <div className="flex flex-col md:flex-row gap-4 pt-10">
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="secondary" className="border">
              <Link href="/cell-reports">Cell Reports</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in">
                Log In My Account <ArrowRightIcon />
              </Link>
            </Button>
          </SignedOut>
        </div>
      </main>
    </>
  );
}
