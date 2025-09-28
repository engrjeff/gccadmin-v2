"use client";

import { ChurchStatus } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemberStatistics } from "@/hooks/use-member-statistics";
import { removeUnderscores } from "@/lib/utils";

export function MemberStatisticsByChurchStatus() {
  const members = useMemberStatistics<"churchStatus", ChurchStatus>(
    "churchStatus",
  );

  if (members.isLoading)
    return (
      <div>
        <Skeleton className="h-[230px]" />
      </div>
    );

  const total =
    members.data?.reduce((total, a) => total + a._count.churchStatus, 0) ?? 100;

  return (
    <div className="flex flex-col gap-4 border-b-0 pb-4">
      <p className="font-semibold text-sm">Members by Church Status</p>
      <ul className="space-y-4">
        {members.data?.map((member) => (
          <li key={`stat-${member.churchStatus}`}>
            <p className="flex justify-between text-sm">
              <span className="font-medium text-gray-900 capitalize dark:text-gray-50">
                {removeUnderscores(member.churchStatus)}
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {member._count.churchStatus}
                <span className="font-normal text-gray-500">/{total}</span>
                <span className="pl-2">
                  ({((member._count.churchStatus / total) * 100).toFixed(1)}%)
                </span>
              </span>
            </p>
            <div className="mt-2 flex w-full items-center [&>*]:h-2">
              <div className="relative flex w-full items-center bg-blue-100 dark:bg-blue-500/30">
                <div
                  className="h-full flex-col bg-blue-600 dark:bg-blue-500"
                  style={{
                    width: `${(member._count.churchStatus / total) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto text-muted-foreground text-sm">
        The majority of members are{" "}
        <span className="text-blue-500">
          {getChurchStatusLabel(
            members.data?.at(0)?.churchStatus as ChurchStatus,
          )}
        </span>{" "}
        in church.
      </p>
    </div>
  );
}

function getChurchStatusLabel(status: ChurchStatus) {
  switch (status) {
    case ChurchStatus.REGULAR:
      return "Regular";
    case ChurchStatus.ACS:
      return "already attended church but not consistent";
    case ChurchStatus.NACS:
      return "not yet attended church";
    default:
      return "";
  }
}
