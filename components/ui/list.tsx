// components/ui/list.tsx

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

export const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border bg-background divide-y divide-border",
      className,
    )}
    {...props}
  />
));
List.displayName = "List";

type ListItemProps = {
  disabled?: boolean;
} & React.HTMLAttributes<HTMLLIElement>;

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ disabled, className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center px-4 p0-3 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "active:bg-accent/80",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

export const ListItemLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex mr-4 shrink-0 items-center justify-center", className)}
    onClick={(e) => e.stopPropagation()}
    {...props}
  />
));
ListItemLeading.displayName = "ListItemLeading";

export const ListItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex py-3 flex-1 flex-col overflow-hidden", className)}
    {...props}
  />
));
ListItemContent.displayName = "ListItemContent";

export const ListItemLinkContent = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>(({ className, ...props }, ref) => (
  <Link
    className={cn("flex py-3 flex-1 flex-col overflow-hidden", className)}
    {...props}
    ref={ref}
  />
));
ListItemLinkContent.displayName = "ListItemLinkContent";

export const ListItemPrimary = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate text-sm font-medium w-max", className)}
    {...props}
  />
));
ListItemPrimary.displayName = "ListItemPrimary";

export const ListItemSecondary = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate text-xs text-muted-foreground", className)}
    {...props}
  />
));
ListItemSecondary.displayName = "ListItemSecondary";

export const ListItemTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-2 flex shrink-0 items-center", className)}
    onClick={(e) => e.stopPropagation()}
    {...props}
  />
));
ListItemTrailing.displayName = "ListItemTrailing";
