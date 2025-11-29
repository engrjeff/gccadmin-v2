"use client";

import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import type { Gender, MemberType } from "@/app/generated/prisma";
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
import { removeUnderscores } from "@/lib/utils";
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

export function ChurchMembersTable({ gender }: { gender: Gender }) {
  const searchParams = useSearchParams();

  const memberTypeQuery =
    (searchParams.get("memberType") as MemberType) ?? undefined;

  const searchQuery = (searchParams.get("q") as string) ?? undefined;

  const churchMembersQuery = useChurchMembers({
    gender,
    memberType: memberTypeQuery,
    q: searchQuery,
  });

  const form = useFormContext<AddAttendeesInputs>();

  if (churchMembersQuery.isLoading)
    return (
      <div className="max-h-full space-y-4 overflow-hidden">
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
        <Skeleton className="h-[60vh] rounded-md border bg-card" />
      </div>
    );

  const churchMembersData = churchMembersQuery.data?.churchMembers;

  const subheaders = churchMembersData?.map((c) => c.label);

  const attendeesValues = form.watch("attendees").map((a) => a.id);

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
          {subheaders?.map((subheader, subheaderIndex) => (
            <Fragment key={subheader}>
              <TableRow className="pointer-events-none bg-card">
                <TableCell colSpan={COL_COUNT - 1}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-500 text-xs uppercase">
                      {subheader}
                    </span>
                    <span className="font-semibold text-green-500 text-xs">
                      Subtotal
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-green-500">
                  {getSubTotal(
                    attendeesValues,
                    churchMembersData
                      ?.at(subheaderIndex)
                      ?.members?.map((m) => m.id) ?? [],
                  )}
                </TableCell>
              </TableRow>
              {churchMembersData?.at(subheaderIndex)?.members?.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={COL_COUNT}>
                    No members found under this Network
                  </TableCell>
                </TableRow>
              ) : (
                churchMembersData
                  ?.at(subheaderIndex)
                  ?.members.map((member, memberIndex) => (
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
                      <TableCell className="p-0 text-center">
                        <AttendanceCheckField memberId={member.id} />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
