"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import { useLeaders } from "@/hooks/use-leaders";
import { getClientDateRange } from "@/lib/utils";

export function NoCellReportAlert() {
  const lastWeek = getClientDateRange("last_week");
  const lastMonth = getClientDateRange("last_month");

  const leadersQuery = useLeaders({ enabled: true });

  const lastWeekCGStatsQuery = useCellGroupStatistics({
    dateRange: {
      from: lastWeek?.start,
      to: lastWeek?.end,
    },
  });

  const lastMonthCGStatsQuery = useCellGroupStatistics({
    dateRange: {
      from: lastMonth?.start,
      to: lastMonth?.end,
    },
  });

  if (
    lastWeekCGStatsQuery.isLoading ||
    lastMonthCGStatsQuery.isLoading ||
    leadersQuery.isLoading
  ) {
    return null;
  }

  const leadersMap = new Map(
    leadersQuery.data?.map((leader) => {
      const reportsByLeader = lastWeekCGStatsQuery.data?.cellReports.filter(
        (c) => c.leaderId === leader.id,
      );

      const cgCount = reportsByLeader?.length ?? 0;

      return [
        leader.name,
        {
          id: leader.id,
          gender: leader.gender,
          name: leader.name,
          cgCount,
        },
      ];
    }),
  );

  const noReportsLastWeek = Array.from(leadersMap.values()).filter(
    (leader) => leader.cgCount === 0,
  );

  const leadersMap2 = new Map(
    leadersQuery.data?.map((leader) => {
      const reportsByLeader = lastMonthCGStatsQuery.data?.cellReports.filter(
        (c) => c.leaderId === leader.id,
      );

      const cgCount = reportsByLeader?.length ?? 0;

      return [
        leader.name,
        {
          id: leader.id,
          gender: leader.gender,
          name: leader.name,
          cgCount,
        },
      ];
    }),
  );

  const noReportsLastMonth = Array.from(leadersMap2.values()).filter(
    (leader) => leader.cgCount === 0,
  );

  const shouldShowAlert =
    noReportsLastWeek?.length || noReportsLastMonth?.length;

  if (!shouldShowAlert) return null;

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            No Cell Reports Alert
          </AlertDialogTitle>
          <AlertDialogDescription>
            The following leaders have not submitted their cell reports for last
            week and/or for last month:
          </AlertDialogDescription>
          <div className="space-y-4">
            {noReportsLastWeek.length > 0 ? (
              <div className="space-y-2 rounded border bg-card p-3">
                <p className="text-muted-foreground text-xs">
                  No Cell Reports Last Week
                </p>
                <ul className="max-h-[180px] list-disc space-y-2 overflow-y-auto pl-6">
                  {noReportsLastWeek.map((leader) => (
                    <li key={leader.id}>
                      <p className="text-sm">{leader.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {noReportsLastMonth.length > 0 ? (
              <div className="space-y-2 rounded border bg-card p-3">
                <p className="text-muted-foreground text-xs">
                  No Cell Reports Last Month
                </p>
                <ul className="max-h-[180px] list-disc space-y-2 overflow-y-auto pl-6">
                  {noReportsLastMonth.map((leader) => (
                    <li key={leader.id}>
                      <p className="text-sm">{leader.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button type="button" variant="destructive">
              I will inform them
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
