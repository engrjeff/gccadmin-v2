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
import { useAssistantLeaders } from "@/hooks/use-assistant-leaders";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import {
  cellStatuses,
  churchStatuses,
  discipleStatusOptions,
  memberTypes,
  processLevels,
} from "@/lib/constants";
import { removeUnderscores } from "@/lib/utils";

const validFilters = [
  "memberType",
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
  const isAdmin = useIsAdmin();

  const leadersQuery = useLeaders({ enabled: isAdmin });
  const assistantLeadersQuery = useAssistantLeaders();

  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = validFilters.reduce((count, filterName) => {
    const param = searchParams.get(filterName);
    return count + (param ? param.split(",").filter(Boolean).length : 0);
  }, 0);

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
        <div className="relative">
          <DrawerTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Open filters">
              <Settings2Icon />
            </Button>
          </DrawerTrigger>
          {activeFilterCount ? (
            <Badge className="-top-1.5 -translate-x-3.5 absolute left-full min-w-5 bg-foreground px-1 text-background">
              {activeFilterCount}
            </Badge>
          ) : null}
        </div>
        <DrawerContent className="h-[75vh]">
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
                singleSelection
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
              <FilterContent
                label="Member Type"
                options={memberTypes}
                queryName="memberType"
                tempFilters={tempFilters}
                singleSelection
                updateTempFilter={updateTempFilter}
                isPending={isPending}
              />
              {isAdmin ? (
                <FilterContent
                  label="Leader"
                  queryName="leader"
                  useLabelDisplay
                  options={
                    leadersQuery.data?.map((leader) => ({
                      value: leader.id,
                      label: leader.name,
                    })) ?? []
                  }
                  tempFilters={tempFilters}
                  updateTempFilter={updateTempFilter}
                  singleSelection
                  isPending={isPending}
                />
              ) : null}
              <FilterContent
                label="Handled By"
                queryName="handledby"
                useLabelDisplay
                options={
                  assistantLeadersQuery.data?.map((assistant) => ({
                    value: assistant.id,
                    label: assistant.name,
                  })) ?? []
                }
                tempFilters={tempFilters}
                updateTempFilter={updateTempFilter}
                singleSelection
                isPending={isPending}
              />
            </Accordion>
          </div>
          <DrawerFooter className="flex-row items-center gap-4 border-t p-4 pb-4!">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isPending}
              className="flex-1"
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
  singleSelection?: boolean;
  Icon?: LucideIcon;
  useLabelDisplay?: boolean;
}

export function FilterContent({
  label,
  options,
  queryName,
  tempFilters,
  updateTempFilter,
  isPending,
  singleSelection,
  useLabelDisplay,
}: FilterFieldProps) {
  const searchParams = useSearchParams();

  const currentValues = useMemo(() => {
    const param = searchParams.get(queryName);
    return param ? param.split(",").filter(Boolean) : [];
  }, [searchParams, queryName]);

  const tempSelectedValues = tempFilters[queryName] ?? currentValues;

  const hasActiveFilters = tempSelectedValues.length > 0;

  const moreCount = tempSelectedValues.length - 2;

  const handleCheckboxChange = useCallback(
    (value: string, checked: boolean) => {
      let newValues: string[];

      if (checked) {
        newValues = singleSelection ? [value] : [...tempSelectedValues, value];
      } else {
        newValues = tempSelectedValues.filter((v) => v !== value);
      }

      updateTempFilter(queryName, newValues);
    },
    [tempSelectedValues, singleSelection, queryName, updateTempFilter],
  );

  return (
    <AccordionItem
      value={queryName}
      className="relative outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
    >
      <AccordionPrimitive.Header className="flex px-3 hover:bg-secondary/40">
        <AccordionPrimitive.Trigger className="flex h-12 flex-1 items-center gap-4 text-left font-semibold text-sm leading-6 outline-none transition-all focus-visible:ring-0 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
          {label}
          {hasActiveFilters ? (
            <Badge variant="MALE">
              {useLabelDisplay
                ? options.find((o) => o.value === tempSelectedValues[0])?.label
                : tempSelectedValues
                    ?.slice(0, 2)
                    ?.map(removeUnderscores)
                    ?.join(", ")}
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
      <AccordionContent className="pb-0">
        {options.map((option) => {
          const isChecked = tempSelectedValues.includes(option.value);
          return (
            <div
              key={option.value}
              className="flex h-11 items-center gap-2 rounded-none hover:bg-secondary"
            >
              <label
                htmlFor={`${queryName}-${option.value}`}
                className="flex h-full flex-1 cursor-pointer items-center gap-3 px-3 font-medium text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Checkbox
                  id={`${queryName}-${option.value}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.value, Boolean(checked))
                  }
                  disabled={isPending}
                />
                {option.label}
              </label>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
