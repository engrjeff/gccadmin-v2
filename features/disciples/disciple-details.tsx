"use client";

import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CellStatusBadge } from "./cell-status-badge";
import { ChurchStatusBadge } from "./church-status-badge";
import { DiscipleEditForm } from "./disciple-edit-form";
import { MemberTypeBadge } from "./member-type-badge";
import { ProcessLevelBadge } from "./process-level-badge";
import { ProcessLevelStatusStatusBadge } from "./process-level-status-badge";

export function DiscipleDetails({
  disciple,
}: {
  disciple: Disciple & { leader: Disciple | null; handledBy: Disciple | null };
}) {
  return (
    <div className="rounded-md border py-4 relative">
      <div className="px-4">
        <h3 className="font-semibold">Disciple Details</h3>
        <div className="absolute top-4 right-4">
          <EditDiscipleSheet disciple={disciple} />
        </div>
      </div>
      <div className="divide-y">
        <div className="px-4 py-2 text-sm">
          <p>Name</p>
          <p className="text-muted-foreground">{disciple.name}</p>
        </div>
        <div className="px-4 py-2 text-sm">
          <p>Network Leader</p>
          <p className="text-muted-foreground">{disciple.leader?.name}</p>
        </div>
        {disciple.handledById ? (
          <div className="px-4 py-2 text-sm">
            <p>Handled By</p>
            <p className="text-muted-foreground">{disciple.handledBy?.name}</p>
          </div>
        ) : null}
        <div className="px-4 py-2 text-sm">
          <p>Address</p>
          <p className="text-muted-foreground">{disciple.address}</p>
        </div>
        <div className="px-4 py-2 text-sm">
          <p>Birthdate</p>
          <p className="text-muted-foreground">
            {format(new Date(disciple.birthdate), "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm capitalize">
          <p>Member Type</p>
          <MemberTypeBadge memberType={disciple.memberType} />
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Cell Status</p>
          <CellStatusBadge cellStatus={disciple.cellStatus} />
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Church Status</p>
          <ChurchStatusBadge churchStatus={disciple.churchStatus} />
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Process Level</p>
          <ProcessLevelBadge processLevel={disciple.processLevel} />
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Process Status</p>
          <ProcessLevelStatusStatusBadge
            processLevelStatus={disciple.processLevelStatus}
          />
        </div>
      </div>
    </div>
  );
}

function EditDiscipleSheet({ disciple }: { disciple: Disciple }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost">
          <PencilIcon /> Update
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Update Disciple</SheetTitle>
          <SheetDescription>Make sure to save your changes.</SheetDescription>
        </SheetHeader>
        <DiscipleEditForm
          disciple={disciple}
          onAfterSave={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
