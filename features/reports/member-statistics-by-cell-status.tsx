"use client";

import type { CellStatus } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemberStatistics } from "@/hooks/use-member-statistics";
import { removeUnderscores } from "@/lib/utils";

export function MemberStatisticsByCellStatus() {
  const members = useMemberStatistics<"cellStatus", CellStatus>("cellStatus");

  if (members.isLoading)
    return (
      <div className="p-4">
        <Skeleton className="h-[230px]" />
      </div>
    );

  const total =
    members.data?.reduce((total, a) => total + a._count.cellStatus, 0) ?? 100;

  return (
    <div className="flex flex-col gap-4 border-b pb-4 sm:border-b-0">
      <p className="text-sm font-semibold">Members by Cell Status</p>
      <ul className="space-y-4">
        {members.data?.map((member) => (
          <li key={`stat-${member.cellStatus}`}>
            <p className="flex justify-between text-sm">
              <span className="font-medium capitalize text-gray-900 dark:text-gray-50">
                {removeUnderscores(member.cellStatus)}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {member._count.cellStatus}
                <span className="font-normal text-gray-500">/{total}</span>
                <span className="pl-2">
                  ({((member._count.cellStatus / total) * 100).toFixed(1)}%)
                </span>
              </span>
            </p>
            <div className="mt-2 flex w-full items-center [&>*]:h-2">
              <div className="relative flex w-full items-center bg-blue-100 dark:bg-blue-500/30">
                <div
                  className="h-full flex-col bg-blue-600 dark:bg-blue-500"
                  style={{
                    width: `${(member._count.cellStatus / total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-auto text-sm text-muted-foreground">
        The majority of members are{" "}
        <span className="text-blue-500 capitalize">
          {removeUnderscores(members.data?.at(0)?.cellStatus as string)}
        </span>{" "}
        in cell group.
      </p>
    </div>
  );
}
