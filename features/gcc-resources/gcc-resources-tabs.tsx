"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GCCResourcesTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b flex items-center pb-2 gap-1">
      <Button
        size="sm"
        variant={
          pathname.startsWith("/gcc-resources/lessons") ? "secondary" : "ghost"
        }
        asChild
      >
        <Link href="/gcc-resources">CG Lessons</Link>
      </Button>
      <Button
        size="sm"
        variant={
          pathname.startsWith("/gcc-resources/preachings")
            ? "secondary"
            : "ghost"
        }
        asChild
      >
        <Link href="/gcc-resources/preachings">Preachings</Link>
      </Button>
      <Button
        size="sm"
        variant={
          pathname.startsWith("/gcc-resources/others") ? "secondary" : "ghost"
        }
        asChild
      >
        <Link href="/gcc-resources/others">Others</Link>
      </Button>
    </div>
  );
}
