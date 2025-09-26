"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

const chartConfig = {
  discipleship: {
    label: "Discipleship",
    color: "var(--chart-1)",
  },
  open: {
    label: "Open Cell",
    color: "var(--chart-2)",
  },
  soulwinning: {
    label: "Soul Winning",
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
          <Skeleton className="h-[250px]" />
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
      <CardContent className="px-4 pt-4 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              minTickGap={30}
              tickFormatter={(value: string) => {
                return value.slice(0, 3);
              }}
            />
            <YAxis domain={[0, "dataMax + 0.1"]} hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="discipleship"
              fill="var(--color-discipleship)"
              radius={0}
            />
            <Bar dataKey="open" fill="var(--color-open)" radius={0} />
            <Bar
              dataKey="soulwinning"
              fill="var(--color-soulwinning)"
              radius={0}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
