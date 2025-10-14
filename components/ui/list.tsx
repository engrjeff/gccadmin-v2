// components/ui/list.tsx

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

export const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("w-full space-y-3", className)} {...props} />
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
          "p0-3 relative flex w-full cursor-pointer select-none items-center rounded-md border px-4 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
    className={cn("mr-4 flex shrink-0 items-center justify-center", className)}
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
    className={cn("flex flex-1 flex-col overflow-hidden py-3", className)}
    {...props}
  />
));
ListItemContent.displayName = "ListItemContent";

export const ListItemLinkContent = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>(({ className, ...props }, ref) => (
  <Link
    className={cn("flex flex-1 flex-col overflow-hidden py-3", className)}
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
    className={cn("w-max truncate font-medium text-sm", className)}
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
    className={cn("truncate text-muted-foreground text-xs", className)}
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
