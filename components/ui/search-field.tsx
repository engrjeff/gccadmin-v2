"use client";

import { Loader2, SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  placeholder?: string;
  className?: string;
  paramName?: string;
  debounceMs?: number;
}

export function SearchField({
  placeholder = "Search...",
  className,
  paramName = "search",
  debounceMs = 300,
}: SearchFieldProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    searchParams.get(paramName) || "",
  );

  const updateUrl = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(searchParams);

      if (value.trim()) {
        // Reset to first page when searching
        newParams.delete("page");
        newParams.set(paramName, value.trim());
      } else {
        newParams.delete(paramName);
      }

      // Update URL with new search params
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl);
    },
    [searchParams, pathname, paramName, router],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new timeout
      debounceRef.current = setTimeout(() => {
        startTransition(() => {
          updateUrl(value);
        });
      }, debounceMs);
    },
    [updateUrl, debounceMs],
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    // Clear debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    // Immediately update URL
    startTransition(() => {
      updateUrl("");
    });
  }, [updateUrl]);

  return (
    <div className={cn("relative w-full max-w-full md:max-w-xs", className)}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        className="pr-16 pl-7 md:h-8"
      />
      {isPending && (
        <Loader2 className="text-muted-foreground absolute top-1/2 right-1 size-4 -translate-y-1/2 animate-spin" />
      )}
      {searchValue && !isPending && (
        <Button
          variant="ghost"
          size="iconSm"
          className="hover:bg-muted absolute top-1/2 right-1 size-6 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <XIcon />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
