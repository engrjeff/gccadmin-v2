"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { LibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { app } from "@/lib/config";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export function AppHeader() {
  const user = useUser();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="relative flex w-full items-center gap-1 px-4 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Link
          href="/"
          className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 flex items-center gap-x-2 lg:hidden"
        >
          <Image
            unoptimized
            src="/gcc-logo.svg"
            alt={app.title}
            width={30}
            height={30}
          />
        </Link>
        {user.isLoaded ? (
          <h1 className="hidden font-medium text-base lg:block">
            Good day, {user.user?.fullName}!
          </h1>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="iconSm"
            variant="ghost"
            className="rounded-full"
            asChild
          >
            <Link href="/gcc-resources/lessons">
              <LibraryIcon /> <span className="sr-only">GCC Resources</span>
            </Link>
          </Button>
          <ClerkLoading>
            <Skeleton aria-label="Loading" className="size-7 rounded-full" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
