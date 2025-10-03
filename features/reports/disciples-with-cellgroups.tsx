"use client";

import { CalendarIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCellGroupStatistics } from "@/hooks/use-cell-group-statistics";
import { formatDate, getClientDateRange } from "@/lib/utils";

export function DisciplesWithCellGroups() {
  const thisWeek = getClientDateRange("this_week");

  const cgQuery = useCellGroupStatistics({
    dateRange: { from: thisWeek?.start, to: thisWeek?.end },
  });

  if (cgQuery.isLoading)
    return (
      <Card className="gap-0 bg-card/60 py-4">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Disciples with Cell Groups</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pb-0">
          <Skeleton className="h-[240px]" />
        </CardContent>
      </Card>
    );

  const periodDate = cgQuery.data?.dateRangeFilter;

  const cellGroupsWithAssistants = cgQuery.data?.cellReports.filter(
    (c) => c.assistant,
  );

  const assistantCgCountMap = new Map<
    string,
    { name: string; id: string; cgCount: number }
  >();

  cellGroupsWithAssistants?.forEach((c) => {
    if (c.assistant && !assistantCgCountMap.has(c.assistant.id)) {
      assistantCgCountMap.set(c.assistant.id, {
        id: c.assistant.id,
        name: c.assistant.name,
        cgCount: 1,
      });
    } else {
      if (c.assistant) {
        const item = assistantCgCountMap.get(c.assistant.id);

        if (item) {
          assistantCgCountMap.set(item.id, {
            id: item.id,
            name: item.name,
            cgCount: item.cgCount + 1,
          });
        }
      }
    }
  });

  const data = Array.from(assistantCgCountMap.values());

  return (
    <Card className="h-full gap-0 bg-card/60 py-4">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Disciples with Cell Groups</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <CalendarIcon className="size-3" />
          <span>
            {formatDate(periodDate?.start as string)} -{" "}
            {formatDate(periodDate?.end as string)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[260px] flex-1 overflow-auto px-4 pt-4 [&>div]:h-full">
        {data.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3">
            <PackageIcon className="size-6 text-muted-foreground" />
            <p className="text-center text-muted-foreground text-sm">
              No records to show.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data?.map((item) => (
              <li key={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/disciples/${item.id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground text-xs capitalize">
                      Assistant Leader
                    </p>
                  </div>
                  <Badge variant="DISCIPLESHIP">
                    {item.cgCount} {pluralize("cell group", item.cgCount)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
