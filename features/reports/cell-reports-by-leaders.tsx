"use client";

import { CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Gender } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useLeaders } from "@/hooks/use-leaders";
import { cn } from "@/lib/utils";
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
  const [breakdownShown, setBreakdownShown] = useState(true);

  if (leadersQuery.isLoading || isLoading)
    return (
      <Card className="gap-0 rounded-none border-0 border-t bg-card/60 py-4">
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
          breakdown: Array.from(cgBreakdownMap.values()).sort((a, b) =>
            a.cgCount < b.cgCount ? 1 : -1,
          ),
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
    <Card className="gap-0 rounded-none border-0 border-t bg-card/60 py-4">
      <div className="flex items-center justify-between border-b px-4 [.border-b]:pb-4">
        <div className="space-y-2">
          <CardTitle>Cell Groups by Leaders</CardTitle>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3 shrink-0" />
            <span className="block">{dateRangeLabel}</span>
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-breakdown"
            checked={breakdownShown}
            onCheckedChange={setBreakdownShown}
          />
          <Label htmlFor="show-breakdown" className="text-xs">
            Show Breakdown
          </Label>
        </div>
      </div>
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
                    <CellGroupBar
                      leader={leader}
                      maxCGCount={maxMaleCgCount}
                      currentDateRange={currentDateRange}
                      showBreakdown={breakdownShown}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-sm">Female Leaders</p>
              <ul className="space-y-2">
                {femaleData?.map((leader) => (
                  <li key={leader.id}>
                    <CellGroupBar
                      leader={leader}
                      maxCGCount={maxFemaleCgCount}
                      currentDateRange={currentDateRange}
                      showBreakdown={breakdownShown}
                    />
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

function CellGroupBar({
  currentDateRange,
  maxCGCount,
  leader,
  showBreakdown,
}: {
  currentDateRange: string;
  maxCGCount: number;
  showBreakdown?: boolean;
  leader: {
    id: string;
    gender: Gender;
    name: string;
    cgCount: number;
    breakdown: {
      assistantId: string;
      assistantName: string;
      cgCount: number;
    }[];
  };
}) {
  return (
    <div>
      <Link
        href={{
          pathname: "/cell-reports",
          query: {
            leader: leader.id,
            dateRange: currentDateRange,
          },
        }}
      >
        <div
          className={cn(
            "relative flex h-7 items-center overflow-hidden rounded",
            leader.gender === Gender.MALE ? "bg-blue-600/10" : "bg-rose-600/10",
          )}
        >
          <div
            style={{
              width: `${(leader.cgCount / maxCGCount) * 100}%`,
            }}
            className={cn(
              "absolute top-0 left-0 h-full transition-all",
              leader.gender === Gender.MALE ? "bg-blue-500" : "bg-rose-500",
            )}
          ></div>
          <div className="z-10 flex h-full w-full items-center justify-between px-3 text-xs">
            <span>{leader.name}</span>
            <span>{leader.cgCount}</span>
          </div>
        </div>
      </Link>

      {showBreakdown && leader.breakdown.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {leader.breakdown.map((bd) => (
            <li key={bd.assistantId} className="mt-1 ml-4 text-xs">
              <div
                className={cn(
                  "relative flex h-7 items-center overflow-hidden rounded",
                  leader.gender === Gender.MALE
                    ? "bg-blue-600/10"
                    : "bg-rose-600/10",
                )}
              >
                <div
                  style={{
                    width: `${(bd.cgCount / leader.cgCount) * 100}%`,
                  }}
                  className={cn(
                    "absolute top-0 left-0 h-full transition-all",
                    leader.gender === Gender.MALE
                      ? "bg-blue-500/50"
                      : "bg-rose-500/50",
                  )}
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
    </div>
  );
}
