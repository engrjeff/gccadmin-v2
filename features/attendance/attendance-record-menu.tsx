"use client";

import {
  LockIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttendanceRecordDeleteDialog } from "./attendance-record-delete-dialog";

type Action = "lock" | "delete" | "edit";

export function AttendanceRecordMenu({
  attendanceId,
  attendanceTitle,
  forCard,
}: {
  attendanceId: string;
  attendanceTitle: string;
  forCard?: boolean;
}) {
  const [action, setAction] = useState<Action>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="iconSm"
            variant={forCard ? "ghost" : "outline"}
            aria-label="Attendance record actions"
            className="size-8"
          >
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("lock")}>
            <LockIcon /> Lock Attendance
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAction("delete")}
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* delete dialog */}
      <AttendanceRecordDeleteDialog
        attendanceId={attendanceId}
        attendanceTitle={attendanceTitle}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
