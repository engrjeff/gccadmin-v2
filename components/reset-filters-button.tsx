"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ResetFiltersButtonProps {
  validFilters: string[];
}

export function ResetFiltersButton({ validFilters }: ResetFiltersButtonProps) {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const filterEntries = Array.from(searchParams.entries()).filter(([key]) =>
    validFilters.includes(key),
  );

  const hasActiveFilters = filterEntries.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Button size="sm" variant="ghost" className="border border-dashed" asChild>
      <Link href={pathname}>
        <XIcon />
        Clear Filters
      </Link>
    </Button>
  );
}
