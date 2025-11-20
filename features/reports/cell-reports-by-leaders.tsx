"use client";

import { CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { Gender } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaders } from "@/hooks/use-leaders";
import type { DateRange, SimpleCellReport } from "@/types/globals";

export function CellReportsByLeaders({
  cellReports,
  dateRangeLabel,
  currentDateRange,
  isLoading,
}: {
  cellReports: SimpleCellReport[];
  dateRangeLabel: string;
  currentDateRange: DateRange;
  isLoading?: boolean;
}) {
  const leadersQuery = useLeaders({ enabled: true });

  if (leadersQuery.isLoading || isLoading)
    return (
      <Card className="gap-0 bg-card/60 py-4">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Cell Groups by Leaders</CardTitle>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pb-0">
          <Skeleton className="h-[240px]" />
        </CardContent>
      </Card>
    );

  const leadersMap = new Map(
    leadersQuery.data?.map((leader) => {
      const reportsByLeader = cellReports.filter(
        (c) => c.leaderId === leader.id,
      );

      const cgCount = reportsByLeader?.length ?? 0;

      const cgBreakdownMap = new Map<
        string,
        { assistantId: string; assistantName: string; cgCount: number }
      >();

      reportsByLeader.forEach((report) => {
        if (!report.assistant) return;

        const assistantRecord = cgBreakdownMap.get(report.assistant.id);

        if (assistantRecord) {
          cgBreakdownMap.set(report.assistant.id, {
            ...assistantRecord,
            cgCount: assistantRecord.cgCount + 1,
          });
        } else {
          cgBreakdownMap.set(report.assistant.id, {
            assistantId: report.assistant.id,
            assistantName: report.assistant.name,
            cgCount: 1,
          });
        }
      });

      return [
        leader.name,
        {
          id: leader.id,
          gender: leader.gender,
          name: leader.name,
          cgCount,
          breakdown: Array.from(cgBreakdownMap.values()),
        },
      ];
    }),
  );

  const dataArray = Array.from(leadersMap.values());

  const maleData = dataArray
    .filter((d) => d.gender === Gender.MALE)
    .sort((a, b) => (a.cgCount < b.cgCount ? 1 : -1));

  const maxMaleCgCount = maleData.length
    ? Math.max(...maleData.map((d) => d.cgCount))
    : 0;

  const femaleData = dataArray
    .filter((d) => d.gender === Gender.FEMALE)
    .sort((a, b) => (a.cgCount < b.cgCount ? 1 : -1));

  const maxFemaleCgCount = femaleData.length
    ? Math.max(...femaleData.map((d) => d.cgCount))
    : 0;

  return (
    <Card className="gap-0 bg-card/60 py-4">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Cell Groups by Leaders</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <CalendarIcon className="size-3 shrink-0" />
          <span className="block">{dateRangeLabel}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pb-0">
        {dataArray.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
            <PackageIcon className="size-6 text-muted-foreground" />
            <p className="text-center text-muted-foreground text-sm">
              No records to show.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 font-semibold text-sm">Male Leaders</p>
              <ul className="space-y-2">
                {maleData?.map((leader) => (
                  <li key={leader.id}>
                    <Link
                      href={{
                        pathname: "/cell-reports",
                        query: {
                          leader: leader.id,
                          dateRange: currentDateRange,
                        },
                      }}
                    >
                      <div className="relative flex h-7 items-center overflow-hidden rounded bg-blue-600/10">
                        <div
                          style={{
                            width: `${(leader.cgCount / maxMaleCgCount) * 100}%`,
                          }}
                          className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                        ></div>
                        <div className="z-10 flex h-full w-full items-center justify-between px-3 text-xs">
                          <span>{leader.name}</span>
                          <span>{leader.cgCount}</span>
                        </div>
                      </div>
                    </Link>

                    {leader.breakdown.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {leader.breakdown.map((bd) => (
                          <li
                            key={bd.assistantId}
                            className="mt-1 ml-6 text-xs"
                          >
                            <div className="relative flex h-7 items-center overflow-hidden rounded bg-blue-600/10">
                              <div
                                style={{
                                  width: `${(bd.cgCount / leader.cgCount) * 100}%`,
                                }}
                                className="absolute top-0 left-0 h-full bg-blue-600/40 transition-all"
                              ></div>
                              <div className="z-10 flex h-full w-full items-center justify-between px-3 text-xs">
                                <span>{bd.assistantName}</span>
                                <span>{bd.cgCount}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-sm">Female Leaders</p>
              <ul className="space-y-2">
                {femaleData?.map((leader) => (
                  <li key={leader.id}>
                    <Link
                      href={{
                        pathname: "/cell-reports",
                        query: {
                          leader: leader.id,
                          dateRange: currentDateRange,
                        },
                      }}
                    >
                      <div className="relative flex h-7 items-center overflow-hidden rounded bg-rose-600/10">
                        <div
                          style={{
                            width: `${(leader.cgCount / maxFemaleCgCount) * 100}%`,
                          }}
                          className="absolute top-0 left-0 h-full bg-rose-500 transition-all"
                        ></div>
                        <div className="z-10 flex h-full w-full items-center justify-between px-3 text-xs">
                          <span>{leader.name}</span>
                          <span>{leader.cgCount}</span>
                        </div>
                      </div>
                    </Link>

                    {leader.breakdown.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {leader.breakdown.map((bd) => (
                          <li
                            key={bd.assistantId}
                            className="mt-1 ml-6 text-xs"
                          >
                            <div className="relative flex h-7 items-center overflow-hidden rounded bg-rose-600/10">
                              <div
                                style={{
                                  width: `${(bd.cgCount / leader.cgCount) * 100}%`,
                                }}
                                className="absolute top-0 left-0 h-full bg-rose-500/40 transition-all"
                              ></div>
                              <div className="z-10 flex h-full w-full items-center justify-between px-3 text-xs">
                                <span>{bd.assistantName}</span>
                                <span>{bd.cgCount}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
