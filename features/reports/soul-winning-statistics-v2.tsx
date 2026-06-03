"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  FlameIcon,
  HelpingHandIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
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
import { useSoulWinningStatisticsV2 } from "@/hooks/use-soul-winning-statistics-v2";

export function SoulWinningStatisticsV2() {
  const query = useSoulWinningStatisticsV2();

  return (
    <Card className="@container/card gap-0 bg-card/60 pt-4 pb-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Soul Winning Activity</CardTitle>
        {query.isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3 shrink-0" />
            <span className="block">Year to date</span>
          </CardDescription>
        )}
        <CardAction>
          <Button
            size="sm"
            variant="link"
            asChild
            className="px-0 text-blue-500 has-[>svg]:px-0"
          >
            <Link href="/soul-winning">
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
              title="SW Sessions"
              currentValue={query.data?.soulWinningSessions ?? 0}
              description="soul winning sessions"
              iconNode={<BookOpenIcon className="size-4 text-green-500" />}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <SoulWinningStatCard
              title="Conso Sessions"
              currentValue={query.data?.consolidationSessions ?? 0}
              description="consolidation sessions"
              iconNode={<HelpingHandIcon className="size-4 text-amber-500" />}
            />
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator className="lg:hidden" />
            <SoulWinningStatCard
              title="New Believers"
              currentValue={query.data?.newBelievers ?? 0}
              description="believers recorded"
              iconNode={<UsersIcon className="size-4 text-blue-500" />}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="space-x-2 border-t p-4 [.border-t]:pt-4">
        <FlameIcon className="size-3 shrink-0 text-orange-500" />
        <p className="text-muted-foreground text-xs">
          Based on reports submitted through the Soul Winning module. Sessions
          and new believers are tracked separately from cell group reports.
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
}: {
  title: string;
  currentValue: number;
  description: string;
  iconNode: ReactNode;
}) {
  return (
    <div className="relative flex flex-col gap-3 p-4">
      <p className="font-semibold text-sm">{title}</p>
      <div className="flex items-end gap-2">
        <div className="font-semibold text-4xl tabular-nums">{currentValue}</div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="absolute top-4 right-2">{iconNode}</div>
    </div>
  );
}
