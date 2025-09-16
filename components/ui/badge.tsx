import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary/60 text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        MALE: "bg-muted/50 border-none text-blue-400 capitalize",

        FEMALE: "bg-muted/50 border-none text-rose-400 capitalize",

        FILTER:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",

        FIRST_TIMER: "bg-muted/50 border-none text-emerald-400 capitalize",
        SECOND_TIMER: "bg-muted/50 border-none text-amber-400 capitalize",
        THIRD_TIMER: "bg-muted/50 border-none text-orange-400 capitalize",
        REGULAR: "bg-muted/50 border-none text-violet-500 capitalize",

        NACS: "bg-muted/50 border-none text-gray-400 capitalize",
        ACS: "bg-muted/50 border-none text-amber-400 capitalize",

        NONE: "bg-muted/50 border-none text-gray-400 capitalize",
        PREENC: "bg-muted/50 border-none text-blue-400 capitalize",
        ENCOUNTER: "bg-muted/50 border-none text-emerald-400 capitalize",
        LEADERSHIP_1: "bg-muted/50 border-none text-amber-400 capitalize",
        LEADERSHIP_2: "bg-muted/50 border-none text-orange-400 capitalize",
        LEADERSHIP_3: "bg-muted/50 border-none text-violet-500 capitalize",

        NOT_STARTED: "bg-muted/50 border-none text-gray-400 capitalize",
        ON_GOING: "bg-muted/50 border-none text-emerald-400 capitalize",
        PENDING_REQUIREMENTS:
          "bg-muted/50 border-none text-amber-400 capitalize",
        FINISHED: "bg-muted/50 border-none text-violet-500 capitalize",
        UNFINISHED: "bg-muted/50 border-none text-rose-400 capitalize",
        DROPPED: "bg-muted/50 border-none text-red-400 capitalize",

        UNCATEGORIZED: "bg-muted/50 border-none text-gray-400 capitalize",
        KIDS: "bg-muted/50 border-none text-emerald-400 capitalize",
        MEN: "bg-muted/50 border-none text-blue-400 capitalize",
        WOMEN: "bg-muted/50 border-none text-rose-400 capitalize",
        YOUTH: "bg-muted/50 border-none text-amber-400 capitalize",
        YOUNGPRO: "bg-muted/50 border-none text-orange-400 capitalize",

        OPEN: "bg-muted/50 border-none text-emerald-400 capitalize",
        SOULWINNING: "bg-muted/50 border-none text-amber-400 capitalize",
        DISCIPLESHIP: "bg-muted/50 border-none text-blue-400 capitalize",

        ACTIVE: "bg-muted/50 border-none text-emerald-400 capitalize",
        INACTIVE: "bg-muted/50 border-none text-red-400 capitalize",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
