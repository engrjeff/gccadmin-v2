import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center max-w-6xl container mx-auto justify-center min-h-[80vh] gap-3 px-6">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="font-bold text-3xl md:text-5xl text-center">
          Welcome to {app.title}!
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          {app.description}
        </p>

        <div className="flex flex-col gap-4 pt-10">
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/cell-reports">Cell Reports</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild>
              <Link href="/sign-in">
                Log In My Account <ArrowRightIcon />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/sign-up">Register</Link>
            </Button>
          </SignedOut>
        </div>
      </main>
      <Footer />
    </>
  );
}
