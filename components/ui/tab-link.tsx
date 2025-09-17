"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function TabLink({ href, className, children, ...props }: TabLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ size: "sm", variant: "ghost" }),
        "relative mb-0.5",
        isActive &&
          "after:absolute after:left-0 after:w-full after:h-1 after:bg-primary after:-bottom-1",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}