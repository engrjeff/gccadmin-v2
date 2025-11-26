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
  const thisMonth = getClientDateRange("this_month");

  const leadersQuery = useLeaders({ enabled: true });

  const lastWeekCGStatsQuery = useCellGroupStatistics({
    dateRange: {
      from: lastWeek?.start,
      to: lastWeek?.end,
    },
  });

  const thisMonthCGStatsQuery = useCellGroupStatistics({
    dateRange: {
      from: thisMonth?.start,
      to: thisMonth?.end,
    },
  });

  if (
    lastWeekCGStatsQuery.isLoading ||
    thisMonthCGStatsQuery.isLoading ||
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
      const reportsByLeader = thisMonthCGStatsQuery.data?.cellReports.filter(
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

  const noReportsThisMonth = Array.from(leadersMap2.values()).filter(
    (leader) => leader.cgCount === 0,
  );

  const shouldShowAlert =
    noReportsLastWeek?.length || noReportsThisMonth?.length;

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
            week and/or for this month:
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
            {noReportsThisMonth.length > 0 ? (
              <div className="space-y-2 rounded border bg-card p-3">
                <p className="text-muted-foreground text-xs">
                  No Cell Reports This Month
                </p>
                <ul className="max-h-[180px] list-disc space-y-2 overflow-y-auto pl-6">
                  {noReportsThisMonth.map((leader) => (
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
