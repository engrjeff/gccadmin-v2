"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  const user = useUser();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        {user.isLoaded ? (
          <h1 className="text-base font-medium">
            Good day, {user.user?.fullName}!
          </h1>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
