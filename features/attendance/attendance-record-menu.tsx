"use client";

import {
  LockIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import type { Attendance } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttendanceFormEditDialog } from "./attendance-form-edit-dialog";
import { AttendanceLockUnlockDialog } from "./attendance-lock-unlock-dialog";
import { AttendanceRecordDeleteDialog } from "./attendance-record-delete-dialog";

type Action = "lock" | "delete" | "edit";

export function AttendanceRecordMenu({
  attendance,
  forCard,
}: {
  attendance: Attendance;
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
            className="size-8 disabled:opacity-100"
            disabled={attendance.isLocked ?? false}
          >
            {attendance.isLocked ? (
              <LockIcon className="size-4 text-amber-500" />
            ) : (
              <MoreVerticalIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction("edit")}>
            <PencilIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={attendance.isLocked ?? false}
            onClick={() => setAction("lock")}
          >
            <LockIcon />
            {attendance.isLocked ? "Locked" : "Lock Attendance"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
        attendanceId={attendance.id}
        attendanceTitle={attendance.title}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />

      {/* edit form dialog */}
      <AttendanceFormEditDialog
        attendance={attendance}
        open={action === "edit"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />

      {/* lock dialog */}
      <AttendanceLockUnlockDialog
        attendanceId={attendance.id}
        attendanceTitle={attendance.title}
        isLocked={attendance.isLocked ?? false}
        open={action === "lock"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
