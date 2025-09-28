"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface MineSwitchProps {
  queryName?: string;
  className?: string;
}

export function MineSwitch({
  queryName = "showMyReportsOnly",
  className
}: MineSwitchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isChecked = searchParams.get(queryName) === "true";

  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      const newParams = new URLSearchParams(searchParams);

      // Reset to first page when changing filter
      newParams.delete("page");

      if (checked) {
        newParams.set(queryName, "true");
      } else {
        newParams.delete(queryName);
      }

      const newUrl = `${pathname}?${newParams.toString()}`;

      startTransition(() => {
        router.replace(newUrl);
      });
    },
    [searchParams, pathname, router, queryName],
  );

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        id={queryName}
        checked={isChecked}
        onCheckedChange={handleSwitchChange}
        disabled={isPending}
      />
      <Label htmlFor={queryName}>My Reports Only</Label>
    </div>
  );
}
