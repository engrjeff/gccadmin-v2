import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
      <Link href="/" className="flex items-center gap-x-4">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={32}
          height={32}
        />
        <span className="font-semibold">{app.title}</span>
      </Link>
      <div className="flex items-center gap-x-4">
        <SignedOut>
          <SignUpButton>
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
