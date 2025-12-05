"use client";

import { ChevronDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConsolidationFormSheet } from "./consolidation-form-sheet";

type Action = "consolidation";

export function SoulWinningCreateDropdown() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action>();

  if (pathname === "/soul-winning/new") return null;

  function reset() {
    setAction(undefined);
    setOpen(false);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="sm">
            <PlusIcon /> Create
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={reset} asChild>
            <Link href="/soul-winning/new">Soul-Winning Report</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("consolidation")}>
            Consolidation Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConsolidationFormSheet
        open={action === "consolidation"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      />
    </>
  );
}
