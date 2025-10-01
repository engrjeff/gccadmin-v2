"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { type LucideIcon, PlusIcon, Settings2Icon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchField } from "@/components/ui/search-field";
import {
  cellStatuses,
  churchStatuses,
  discipleStatusOptions,
  processLevels,
} from "@/lib/constants";
import { removeUnderscores } from "@/lib/utils";

const validFilters = [
  "cellStatus",
  "churchStatus",
  "processLevel",
  "leader",
  "status",
];

export function DisciplesMobileFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // Store temporary filter values for all query names
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({});

  const updateTempFilter = useCallback(
    (queryName: string, values: string[]) => {
      setTempFilters((prev) => ({
        ...prev,
        [queryName]: values,
      }));
    },
    [],
  );

  const handleApply = useCallback(() => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      // Apply all temp filters
      Object.entries(tempFilters).forEach(([queryName, values]) => {
        if (values.length > 0) {
          newParams.set(queryName, values.join(","));
        } else {
          newParams.delete(queryName);
        }
      });

      newParams.delete("page");
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl);
      setIsOpen(false);
    });
  }, [tempFilters, searchParams, pathname, router]);

  const handleReset = useCallback(() => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      // Remove all valid filter query params
      validFilters.forEach((filterName) => {
        newParams.delete(filterName);
      });

      newParams.delete("page");
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.replace(newUrl);

      // Clear temp filters
      const resetFilters = validFilters.reduce(
        (acc, filterName) => {
          acc[filterName] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      );

      setTempFilters(resetFilters);

      setIsOpen(false);
    });
  }, [searchParams, pathname, router]);

  return (
    <div className="flex items-center gap-3 md:hidden">
      <SearchField paramName="q" />
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Open filters">
            <Settings2Icon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left border-b">
            <DrawerTitle className="text-sm">Filters</DrawerTitle>
            <DrawerDescription>
              Narrow down the list through filters.
            </DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Accordion type="multiple" className="w-full">
              <FilterContent
                label="Status"
                options={discipleStatusOptions}
                queryName="status"
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                singleSection
                isPending={isPending}
              />
              <FilterContent
                label="Cell Status"
                options={cellStatuses}
                queryName="cellStatus"
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                isPending={isPending}
              />
              <FilterContent
                label="Church Status"
                options={churchStatuses}
                queryName="churchStatus"
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                isPending={isPending}
              />
              <FilterContent
                label="Process Level"
                options={processLevels}
                queryName="processLevel"
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                isPending={isPending}
              />
            </Accordion>
          </div>
          <DrawerFooter className="flex-row items-center justify-end gap-4 border-t p-4 pb-4!">
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handleApply}
              disabled={isPending}
            >
              Apply
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterFieldProps {
  label: string;
  options: FilterOption[];
  queryName: string;
  tempFilters: Record<string, string[]>;
  updateTempFilter: (queryName: string, values: string[]) => void;
  isPending: boolean;
  className?: string;
  singleSection?: boolean;
  Icon?: LucideIcon;
  useLabelDisplay?: boolean;
}

function FilterContent({
  label,
  options,
  queryName,
  tempFilters,
  updateTempFilter,
  isPending,
  singleSection,
}: FilterFieldProps) {
  const searchParams = useSearchParams();

  const currentValues = useMemo(() => {
    const param = searchParams.get(queryName);
    return param ? param.split(",").filter(Boolean) : [];
  }, [searchParams, queryName]);

  const tempSelectedValues = tempFilters[queryName] ?? currentValues;

  const hasActiveFilters = tempSelectedValues.length > 0;

  const moreCount = tempSelectedValues.length - 1;

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      let newValues: string[];

      if (checked) {
        newValues = singleSection ? [value] : [...tempSelectedValues, value];
      } else {
        newValues = tempSelectedValues.filter((v) => v !== value);
      }

      updateTempFilter(queryName, newValues);
    },
    [tempSelectedValues, singleSection, queryName, updateTempFilter],
  );

  return (
    <AccordionItem
      value={queryName}
      className="relative outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
    >
      <AccordionPrimitive.Header className="flex px-3 hover:bg-secondary/40">
        <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-4 py-2 text-left font-semibold text-sm leading-6 outline-none transition-all focus-visible:ring-0 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
          {label}
          {hasActiveFilters ? (
            <Badge variant="MALE">
              {removeUnderscores(tempSelectedValues.at(0) as string)}
              <span className="normal-case">
                {moreCount > 0 ? `+${moreCount} more` : ""}
              </span>
            </Badge>
          ) : null}
          <PlusIcon
            size={16}
            className="pointer-events-none ml-auto shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionContent>
        <div className="p-1">
          <div className="space-y-0.5">
            {options.map((option) => {
              const isChecked = tempSelectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 rounded px-1.5 py-2 hover:bg-secondary"
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
                    className="flex-1 cursor-pointer font-medium text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
