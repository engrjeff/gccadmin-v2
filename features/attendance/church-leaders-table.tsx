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
import { useChurchMembers } from "@/hooks/use-church-members";
import { AttendanceCheckField } from "./attendance-check-field";
import type { AddAttendeesInputs } from "./schema";
import { TotalAttendeesDisplay } from "./total-attendees-display";

const COL_COUNT = 3;

function getSubTotal(actualValues: string[], toCountValues: string[]) {
  return toCountValues.reduce((count, a) => {
    if (actualValues.includes(a)) {
      return count + 1;
    }

    return count;
  }, 0);
}

export function ChurchLeadersTable() {
  const searchParams = useSearchParams();

  const memberTypeQuery =
    (searchParams.get("memberType") as MemberType) ?? undefined;

  const searchQuery = (searchParams.get("q") as string) ?? undefined;

  const query = useChurchMembers({
    gender: "all",
    memberType: memberTypeQuery,
    q: searchQuery,
  });

  const form = useFormContext<AddAttendeesInputs>();

  if (query.isLoading)
    return (
      <div className="max-h-full space-y-4 overflow-hidden">
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
      </div>
    );

  const churchLeadersData = query.data?.leaders;

  const attendeesValues = form.watch("attendees").map((a) => a.id);

  const maleLeaders = churchLeadersData?.members?.filter(
    (c) => c.gender === Gender.MALE,
  );
  const femaleLeaders = churchLeadersData?.members?.filter(
    (c) => c.gender === Gender.FEMALE,
  );

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-card">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-6 text-center">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-24 text-center font-semibold">
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
                  Male {churchLeadersData?.label}
                </span>
                <span className="font-semibold text-green-500 text-xs">
                  Subtotal
                </span>
              </div>
            </TableCell>
            <TableCell className="border-l text-center font-semibold text-green-500">
              {getSubTotal(
                attendeesValues,
                maleLeaders?.map((m) => m.id) ?? [],
              )}
            </TableCell>
          </TableRow>
          {maleLeaders?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COL_COUNT}>
                No male Primary Leaders found
              </TableCell>
            </TableRow>
          ) : (
            maleLeaders?.map((member, memberIndex) => (
              <TableRow
                key={member.id}
                className="hover:bg-transparent has-checked:bg-emerald-800/10"
              >
                <TableCell className="w-6 border-r bg-card text-center">
                  {memberIndex + 1}
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  {member.name}
                </TableCell>
                <TableCell className="p-0 text-center">
                  <AttendanceCheckField memberId={member.id} />
                </TableCell>
              </TableRow>
            ))
          )}

          {/* female primary leaders */}
          <TableRow className="pointer-events-none bg-card">
            <TableCell colSpan={COL_COUNT - 1}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-500 text-xs uppercase">
                  Female {churchLeadersData?.label}
                </span>
                <span className="font-semibold text-green-500 text-xs">
                  Subtotal
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center font-semibold text-green-500">
              {getSubTotal(
                attendeesValues,
                femaleLeaders?.map((m) => m.id) ?? [],
              )}
            </TableCell>
          </TableRow>
          {femaleLeaders?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={COL_COUNT}>
                No female Primary Leaders found
              </TableCell>
            </TableRow>
          ) : (
            femaleLeaders?.map((member, memberIndex) => (
              <TableRow
                key={member.id}
                className="hover:bg-transparent has-checked:bg-emerald-800/10"
              >
                <TableCell className="w-6 border-r bg-card text-center">
                  {memberIndex + 1}
                </TableCell>
                <TableCell className="border-r py-1 text-xs">
                  {member.name}
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
