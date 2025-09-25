"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const dockVariants = cva(
  "fixed bottom-0 left-0 right-0 border-t z-50 flex items-center justify-center gap-1 px-1 py-2.5 shadow-lg sm:hidden",
  {
    variants: {
      variant: {
        default:
          "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90",
        translucent:
          "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90",
        solid: "bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const dockItemVariants = cva(
  "flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent active:scale-95",
        active: "text-foreground [&_svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface DockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dockVariants> {
  children: React.ReactNode;
}

interface DockItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dockItemVariants> {
  children: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  asChild?: boolean;
}

interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DockLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

function Dock({ className, variant, children, ...props }: DockProps) {
  return (
    <nav className={cn(dockVariants({ variant, className }))} {...props}>
      {children}
    </nav>
  );
}

function DockItem({
  className,
  variant,
  children,
  badge,
  active,
  asChild = false,
  ...props
}: DockItemProps) {
  const itemVariant = active ? "active" : variant;
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(dockItemVariants({ variant: itemVariant, className }))}
      role="tab"
      aria-selected={active}
      {...props}
    >
      {children}
    </Comp>
  );
}

function DockIcon({ className, children, ...props }: DockIconProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="flex items-center justify-center [&_svg]:size-3.5">
        {children}
      </div>
    </div>
  );
}

function DockLabel({ className, children, ...props }: DockLabelProps) {
  return (
    <span
      className={cn("text-center leading-tight truncate max-w-full", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Dock, DockItem, DockIcon, DockLabel, dockVariants, dockItemVariants };
export type { DockProps, DockItemProps, DockIconProps, DockLabelProps };
