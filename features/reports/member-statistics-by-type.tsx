"use client";

import Link from "next/link";
import type { MemberType } from "@/app/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemberStatistics } from "@/hooks/use-member-statistics";
import { removeUnderscores } from "@/lib/utils";

export function MemberStatisticsByType() {
  const members = useMemberStatistics<"memberType", MemberType>("memberType");

  if (members.isLoading)
    return (
      <div>
        <Skeleton className="h-[230px]" />
      </div>
    );

  const total =
    members.data?.reduce((total, a) => total + a._count.memberType, 0) ?? 100;

  return (
    <div className="flex flex-col gap-4 border-b pb-4 sm:border-b-0">
      <p className="font-semibold text-sm">Members by Type</p>
      <ul className="space-y-2">
        {members.data?.map((member) => (
          <li key={`stat-${member.memberType}`}>
            <Link
              href={`/disciples?memberType=${member.memberType}`}
              className="block p-1 hover:bg-blue-500/10"
              target="_blank"
            >
              <p className="flex justify-between text-sm">
                <span className="font-medium text-gray-900 capitalize dark:text-gray-50">
                  {removeUnderscores(member.memberType)}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {member._count.memberType}
                  <span className="font-normal text-gray-500">/{total}</span>
                  <span className="pl-2">
                    ({((member._count.memberType / total) * 100).toFixed(1)}%)
                  </span>
                </span>
              </p>
              <div className="mt-2 flex w-full items-center [&>*]:h-2">
                <div className="relative flex w-full items-center bg-blue-100 dark:bg-blue-500/30">
                  <div
                    className="h-full flex-col bg-blue-600 dark:bg-blue-500"
                    style={{
                      width: `${(member._count.memberType / total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
