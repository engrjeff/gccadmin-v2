"use client";

import {
  ArrowRightIcon,
  CalendarIcon,
  FlameIcon,
  HelpingHandIcon,
  HomeIcon,
  LeafIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { CellType } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSoulWinningStatistics } from "@/hooks/use-soul-winning-statistics";

export function SoulWinningStatistics() {
  const query = useSoulWinningStatistics();

  return (
    <Card className="@container/card gap-0 bg-card/60 pt-4 pb-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Soul Winning</CardTitle>
        {query.isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3 shrink-0" />
            <span className="block">As of today</span>
          </CardDescription>
        )}
        <CardAction>
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-0 text-blue-500 has-[>svg]:px-0"
          >
            <Link
              href={{
                pathname: "/cell-reports",
                query: {
                  cellType: CellType.SOULWINNING,
                  dateRange: "year_to_date",
                },
              }}
            >
              View Reports <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {query.isLoading ? (
          <div className="grid grid-cols-1 gap-2 p-4 lg:grid-cols-3">
            <Skeleton className="h-[96px]" />
            <Skeleton className="h-[96px]" />
            <Skeleton className="h-[96px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <SoulWinningStatCard
              title="Won Souls"
              currentValue={query.data?.wonSouls ?? 0}
              description="souls won as of today"
              iconNode={<LeafIcon className="size-4 text-green-500" />}
              total={0}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <SoulWinningStatCard
              title="Consolidated Souls"
              currentValue={query.data?.consolidatedSouls ?? 0}
              description={`out of ${query.data?.wonSouls} won souls`}
              iconNode={<HelpingHandIcon className="size-4 text-amber-500" />}
              total={query.data?.wonSouls ?? 0}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <SoulWinningStatCard
              title="Attended Church"
              currentValue={query.data?.attendedChurchSouls ?? 0}
              description={`out of ${query.data?.wonSouls} won souls`}
              iconNode={<HomeIcon className="size-4 text-blue-500" />}
              total={query.data?.wonSouls ?? 0}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="space-x-2 border-t p-4 [.border-t]:pt-4">
        <FlameIcon className="size-3 shrink-0 text-orange-500" />
        <p className="text-muted-foreground text-xs">
          The insights presented here should serve as prayer points in terms of
          Soul-Winning and Consolidation.
        </p>
      </CardFooter>
    </Card>
  );
}

function SoulWinningStatCard({
  title,
  currentValue,
  description,
  iconNode,
  total,
}: {
  title: string;
  currentValue: number;
  description: string;
  iconNode: ReactNode;
  total: number;
}) {
  function calcPercent(input: number) {
    if (!total) return 0;

    return (input / total) * 100;
  }

  return (
    <div className="relative flex flex-col gap-3 p-4">
      <p className="font-semibold text-sm">{title}</p>
      <div className="flex items-end gap-2">
        <div className="font-semibold text-4xl tabular-nums">
          {currentValue}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
        {total === 0 ? null : (
          <span className="font-semibold text-green-500 text-xs">
            ({calcPercent(currentValue).toFixed(1)}%)
          </span>
        )}
      </div>

      <div className="absolute top-4 right-2">{iconNode}</div>
      {/* <div className="mt-auto">
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-0 text-blue-500 has-[>svg]:px-0"
          >
            <Link
              href={{
                pathname: "/cell-reports",
                query: { dateRange: selectedDateRange },
              }}
            >
              View Reports <ArrowRightIcon />
            </Link>
          </Button>
        </div> */}
    </div>
  );
}
