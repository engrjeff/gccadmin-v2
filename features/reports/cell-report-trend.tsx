"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [view, setView] = useState("all");

  if (trendQuery.isLoading)
    return (
      <Card className="gap-0 bg-card/60 py-4">
        <CardHeader className="border-b px-4 [.border-b]:pb-4">
          <CardTitle>Cell Report Trend</CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <Skeleton className="h-[250px]" />
        </CardContent>
      </Card>
    );

  const year = trendQuery.data?.year;

  const chartData = trendQuery.data?.data;

  const begin = chartData?.at(0)?.month;

  return (
    <Card className="gap-0 bg-card/60 py-4">
      <CardHeader className="border-b px-4 [.border-b]:pb-4">
        <CardTitle>Cell Report Trend</CardTitle>
        <CardDescription>
          {begin} - December {year}
        </CardDescription>
        <CardAction>
          <Tabs value={view} onValueChange={setView} className="hidden md:flex">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="discipleship">Discipleship</TabsTrigger>
              <TabsTrigger value="opencell">Open Cell</TabsTrigger>
              <TabsTrigger value="soulwinning">Soul Winning</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={view} onValueChange={setView}>
            <SelectTrigger
              className="flex **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate md:hidden"
              size="sm"
              aria-label="Select view"
            >
              <SelectValue placeholder="This week" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All
              </SelectItem>
              <SelectItem value="discipleship" className="rounded-lg">
                Discipleship
              </SelectItem>
              <SelectItem value="opencell" className="rounded-lg">
                Open Cell
              </SelectItem>
              <SelectItem value="soulwinning" className="rounded-lg">
                Soul Winning
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 px-4 pt-4">
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
            {view === "discipleship" || view === "all" ? (
              <Bar
                dataKey="discipleship"
                fill="var(--color-discipleship)"
                radius={0}
              />
            ) : null}
            {view === "opencell" || view === "all" ? (
              <Bar dataKey="open" fill="var(--color-open)" radius={0} />
            ) : null}
            {view === "soulwinning" || view === "all" ? (
              <Bar
                dataKey="soulwinning"
                fill="var(--color-soulwinning)"
                radius={0}
              />
            ) : null}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
