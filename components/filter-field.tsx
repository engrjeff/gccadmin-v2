"use client";

import { FilterIcon, Loader2Icon, type LucideIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, removeUnderscores } from "@/lib/utils";
import { Badge } from "./ui/badge";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterFieldProps {
  label: string;
  options: FilterOption[];
  queryName: string;
  className?: string;
  singleSection?: boolean;
  Icon?: LucideIcon;
}

function FilterFieldComponent({
  label,
  options,
  queryName,
  className,
  singleSection,
  Icon = FilterIcon,
}: FilterFieldProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = useMemo(() => {
    const param = searchParams.get(queryName);
    return param ? param.split(",").filter(Boolean) : [];
  }, [searchParams, queryName]);

  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>([]);

  // Initialize temp values when popover opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) {
        setTempSelectedValues([...selectedValues]);
      }
    },
    [selectedValues],
  );

  const updateUrl = useCallback(
    (values: string[]) => {
      const newParams = new URLSearchParams(searchParams);

      if (values.length > 0) {
        newParams.delete("page");
        newParams.set(queryName, values.join(","));
      } else {
        newParams.delete(queryName);
      }

      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl);
    },
    [searchParams, pathname, queryName, router],
  );

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      let newValues: string[];

      if (checked) {
        newValues = singleSection ? [value] : [...tempSelectedValues, value];
      } else {
        newValues = tempSelectedValues.filter((v) => v !== value);
      }

      setTempSelectedValues(newValues);
    },
    [tempSelectedValues, singleSection],
  );

  const handleApply = useCallback(() => {
    startTransition(() => {
      updateUrl(tempSelectedValues);
      setIsOpen(false);
    });
  }, [tempSelectedValues, updateUrl]);

  const handleReset = useCallback(() => {
    setTempSelectedValues([]);
    startTransition(() => {
      updateUrl([]);
      setIsOpen(false);
    });
  }, [updateUrl]);

  const hasActiveFilters = selectedValues.length > 0;

  const moreCount = selectedValues.length - 1;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "border-dashed",
            hasActiveFilters && "border-solid bg-accent has-[>svg]:px-1.5",
            className,
          )}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Icon className="size-4" />
          )}
          {label}
          {hasActiveFilters && (
            <Badge variant="MALE">
              {removeUnderscores(selectedValues.at(0) as string)}{" "}
              <span className="normal-case">
                {moreCount > 0 ? `+${moreCount} more` : ""}
              </span>
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 select-none" align="start">
        <div className="border-b px-3 py-2">
          <h4 className="text-sm font-medium">{label}</h4>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          <div className="space-y-0.5">
            {options.map((option) => {
              const isChecked = tempSelectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-1.5 rounded hover:bg-secondary"
                >
                  <Checkbox
                    id={`${queryName}-${option.value}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.value, Boolean(checked))
                    }
                    disabled={isPending}
                  />
                  <label
                    htmlFor={`${queryName}-${option.value}`}
                    className="text-sm flex-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t p-3">
          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasActiveFilters || isPending}
              className="h-7"
            >
              <XIcon className="size-3" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isPending}
              className="h-7"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function FilterField({ Icon = FilterIcon, ...props }: FilterFieldProps) {
  return (
    <Suspense
      fallback={
        <Button variant="outline" className="border-dashed h-7" disabled>
          <Icon className="size-4" />
          {props.label}
        </Button>
      }
    >
      <FilterFieldComponent {...props} Icon={Icon} />
    </Suspense>
  );
}
