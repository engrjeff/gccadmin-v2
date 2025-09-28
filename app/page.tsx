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
      <main className="container mx-auto flex min-h-[80vh] max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-6">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="text-center font-bold text-3xl md:text-5xl">
          Welcome to {app.title}!
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {app.description}
        </p>

        <div className="flex gap-4 pt-10">
          <SignedIn>
            <Button size="lg" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="lg" asChild variant="secondary">
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
