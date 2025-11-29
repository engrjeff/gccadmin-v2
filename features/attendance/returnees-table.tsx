"use client";

import { useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Gender, type MemberType } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReturnees } from "@/hooks/use-returnees";
import { removeUnderscores } from "@/lib/utils";
import { AttendanceCheckField } from "./attendance-check-field";
import { ReturneeCheckField } from "./returnee-check-field";
import type { AddAttendeesInputs } from "./schema";
import { TotalAttendeesDisplay } from "./total-attendees-display";

const COL_COUNT = 4;

function getSubTotal(actualValues: string[], toCountValues: string[]) {
  return toCountValues.reduce((count, a) => {
    if (actualValues.includes(a)) {
      return count + 1;
    }

    return count;
  }, 0);
}

export function ReturneesTable({
  currentAttendanceId,
}: {
  currentAttendanceId: string;
}) {
  const searchParams = useSearchParams();

  const memberTypeQuery =
    (searchParams.get("memberType") as MemberType) ?? undefined;

  const searchQuery = (searchParams.get("q") as string) ?? undefined;

  const query = useReturnees({
    memberType: memberTypeQuery,
    q: searchQuery,
    currentAttendanceId,
  });

  const form = useFormContext<AddAttendeesInputs>();

  if (query.isLoading)
    return (
      <div className="max-h-full space-y-4 overflow-hidden">
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
      </div>
    );

  const returneesData = query.data;

  const returneesValues = form.watch("returnees").map((r) => r.id);

  const maleReturnees = returneesData?.members?.filter(
    (c) => c.gender === Gender.MALE,
  );
  const femaleReturnees = returneesData?.members?.filter(
    (c) => c.gender === Gender.FEMALE,
  );

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-card">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-6 text-center">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>First Attendance</TableHead>
            <TableHead className="w-24 text-center">
              <TotalAttendeesDisplay />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* male primary leaders */}
          <TableRow className="pointer-events-none bg-card">
            <TableCell colSpan={COL_COUNT - 1}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-500 text-xs uppercase">
                  Male {returneesData?.label}
                </span>
                <span className="font-semibold text-green-500 text-xs">
                  Subtotal
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center font-semibold text-green-500">
              {getSubTotal(
                returneesValues,
                maleReturnees?.map((m) => m.id) ?? [],
              )}
            </TableCell>
          </TableRow>
          {maleReturnees?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COL_COUNT}>No male returnees</TableCell>
            </TableRow>
          ) : (
            maleReturnees?.map((member, memberIndex) => (
              <TableRow
                key={member.id}
                className="hover:bg-transparent has-checked:bg-emerald-800/10"
              >
                <TableCell className="w-6 border-r bg-card text-center">
                  {memberIndex + 1}
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  <p>{member.name}</p>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {removeUnderscores(member.memberType)}
                  </span>
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  <p>{member.firstAttendance}</p>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {member.invitedBy?.name
                      ? `Invited by: ${member.invitedBy.name}`
                      : "Walk-in"}
                  </span>
                </TableCell>
                <TableCell className="p-0 text-center">
                  <ReturneeCheckField memberId={member.id} />
                </TableCell>
              </TableRow>
            ))
          )}

          {/* female primary leaders */}
          <TableRow className="pointer-events-none bg-card">
            <TableCell colSpan={COL_COUNT - 1}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-500 text-xs uppercase">
                  Female {returneesData?.label}
                </span>
                <span className="font-semibold text-green-500 text-xs">
                  Subtotal
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center font-semibold text-green-500">
              {getSubTotal(
                returneesValues,
                femaleReturnees?.map((m) => m.id) ?? [],
              )}
            </TableCell>
          </TableRow>
          {femaleReturnees?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COL_COUNT}>No female returnees</TableCell>
            </TableRow>
          ) : (
            femaleReturnees?.map((member, memberIndex) => (
              <TableRow
                key={member.id}
                className="hover:bg-transparent has-checked:bg-emerald-800/10"
              >
                <TableCell className="w-6 border-r bg-card text-center">
                  {memberIndex + 1}
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  <p>{member.name}</p>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {removeUnderscores(member.memberType)}
                  </span>
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  <p>{member.firstAttendance}</p>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {member.invitedBy?.name
                      ? `Invited by: ${member.invitedBy.name}`
                      : "Walk-in"}
                  </span>
                </TableCell>
                <TableCell className="p-0 text-center">
                  <AttendanceCheckField memberId={member.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
