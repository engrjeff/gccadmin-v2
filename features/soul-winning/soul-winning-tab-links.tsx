"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SoulWinningTabLinks() {
  const pathname = usePathname();

  if (pathname === "/soul-winning/new") return null;

  return (
    <div className="flex items-center gap-0.5 border-b pb-1">
      <SoulWinningTabLink href="/soul-winning">Soul-Winning</SoulWinningTabLink>
      <SoulWinningTabLink href="/soul-winning/consolidation">
        Consolidation
      </SoulWinningTabLink>
      <SoulWinningTabLink href="/soul-winning/new-believers">
        New Believers
      </SoulWinningTabLink>
    </div>
  );
}

function SoulWinningTabLink({
  children,
  ...props
}: PropsWithChildren<LinkProps>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ size: "sm", variant: "ghost" }),
        pathname === (props.href as string)
          ? "rounded-b-none border-primary border-b-2"
          : "",
      )}
    >
      {children}
    </Link>
  );
}
