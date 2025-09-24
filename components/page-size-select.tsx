"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { SelectNative } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface PageSizeSelectProps {
  options?: number[];
  className?: string;
  defaultValue?: number;
}

export function PageSizeSelect({
  options = [12, 24, 50, 100, 200],
  className,
  defaultValue = 12,
}: PageSizeSelectProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentPageSize =
    searchParams.get("pageSize") || defaultValue.toString();

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPageSize = e.target.value;
      const newParams = new URLSearchParams(searchParams);

      // Reset to first page when changing page size
      newParams.delete("page");

      if (!newPageSize) {
        newParams.delete("pageSize");
      }

      if (newPageSize === defaultValue.toString()) {
        newParams.delete("pageSize");
      } else {
        newParams.set("pageSize", newPageSize);
      }

      const newUrl = `${pathname}?${newParams.toString()}`;

      startTransition(() => {
        router.replace(newUrl);
      });
    },
    [searchParams, pathname, router, defaultValue],
  );

  return (
    <div className="inline-flex items-center gap-1.5">
      <Label htmlFor="pageSize" className="shrink-0">
        Rows per page
      </Label>
      <SelectNative
        id="pageSize"
        defaultValue={currentPageSize}
        onChange={handlePageSizeChange}
        disabled={isPending}
        className={cn("h-7 w-16 grow-0 shrink-0", className)}
        aria-label="Page Size"
      >
        {options.map((size) => (
          <option key={size} value={size.toString()}>
            {size}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
