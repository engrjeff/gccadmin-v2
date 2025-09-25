"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useCellReportTrend } from "@/hooks/use-cell-report-trend";

export const description = "A multiple bar chart";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80, test: 80 },
//   { month: "February", desktop: 305, mobile: 200, test: 80 },
//   { month: "March", desktop: 237, mobile: 120, test: 80 },
//   { month: "April", desktop: 73, mobile: 190, test: 80 },
//   { month: "May", desktop: 209, mobile: 130, test: 80 },
//   { month: "June", desktop: 214, mobile: 140, test: 80 },
// ];

const chartConfig = {
  DISCIPLESHIP: {
    label: "DISCIPLESHIP",
    color: "var(--chart-1)",
  },
  OPEN: {
    label: "OPEN",
    color: "var(--chart-2)",
  },
  SOULWINNING: {
    label: "SOULWINNING",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function CellReportTrend() {
  const trendQuery = useCellReportTrend();

  if (trendQuery.isLoading)
    return (
      <Card className="py-4 gap-0">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Cell Report Trend</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <Skeleton className="h-[252px]" />
        </CardContent>
      </Card>
    );

  const year = trendQuery.data?.year;

  const chartData = trendQuery.data?.data;

  const begin = chartData?.at(0)?.month;

  return (
    <Card className="py-4 gap-0">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Cell Report Trend</CardTitle>
        <CardDescription>
          {begin} - December {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="DISCIPLESHIP"
              fill="var(--color-DISCIPLESHIP)"
              radius={4}
            />
            <Bar dataKey="OPEN" fill="var(--color-OPEN)" radius={4} />
            <Bar
              dataKey="SOULWINNING"
              fill="var(--color-SOULWINNING)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
