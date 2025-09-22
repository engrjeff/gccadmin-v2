import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
      <Link href="/" className="flex items-center gap-x-2">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={32}
          height={32}
        />
        <span className="font-semibold">{app.title}</span>
      </Link>
      <div className="flex items-center gap-x-3">
        <Button
          size="iconSm"
          variant="ghost"
          className="md:hidden rounded-full"
          asChild
        >
          <Link href="/gcc-resources/lessons">
            <LibraryIcon /> <span className="sr-only">GCC Resources</span>
          </Link>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="hidden md:inline-flex"
          asChild
        >
          <Link href="/gcc-resources/lessons">
            <LibraryIcon /> GCC Resources
          </Link>
        </Button>
        <SignedOut>
          <SignUpButton>
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>
        <ClerkLoading>
          <Skeleton aria-label="Loading" className="size-7 rounded-full" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkLoaded>
      </div>
    </header>
  );
}
