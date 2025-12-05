"use client";

import { Label, Pie, PieChart } from "recharts";
import { MemberType } from "@/app/generated/prisma";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStatisticsByMemberType } from "@/hooks/use-statistics-by-member-type";
import { removeUnderscores } from "@/lib/utils";

const chartConfig = {
  members: {
    label: "Statistics",
  },
  NACS: {
    label: "NACS",
    color: "var(--chart-2)",
  },
  ACS: {
    label: "ACS",
    color: "var(--chart-3)",
  },
  REGULAR: {
    label: "Regular",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function MemberStatisticsByStatus() {
  return (
    <Card className="flex flex-col gap-0 bg-card/60 py-4">
      <CardHeader className="items-center px-4 pb-4">
        <CardTitle className="capitalize">
          Church Attendance By Member Type
        </CardTitle>
        <CardDescription>As of today</CardDescription>
      </CardHeader>
      <div className="grid min-h-[250px] grid-cols-1 border-t md:grid-cols-2 xl:grid-cols-4">
        <div className="border-r border-b">
          <StatisticsByMemberType memberType={MemberType.YOUTH} />
        </div>
        <div className="border-b lg:border-r">
          <StatisticsByMemberType memberType={MemberType.YOUNGPRO} />
        </div>
        <div className="border-r border-b">
          <StatisticsByMemberType memberType={MemberType.MEN} />
        </div>
        <div className="border-b">
          <StatisticsByMemberType memberType={MemberType.WOMEN} />
        </div>
      </div>
      <CardFooter className="flex-col gap-2 pt-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-chart-2" aria-hidden="true"></span>
            <span className="text-gray-900 text-xs dark:text-gray-50">
              Not yet attended
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-chart-3" aria-hidden="true"></span>
            <span className="text-gray-900 text-xs dark:text-gray-50">
              Attended
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-chart-4" aria-hidden="true"></span>
            <span className="text-gray-900 text-xs dark:text-gray-50">
              Regular
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function StatisticsByMemberType({
  memberType,
}: {
  memberType: MemberType;
}) {
  const query = useStatisticsByMemberType({ memberType });

  if (query.isLoading) return <p>Loading...</p>;

  const chartData = query.data?.data.map((d) => ({
    churchStatus: d.churchStatus,
    members: d._count.churchStatus,
    fill: `var(--color-${d.churchStatus})`,
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="members"
          nameKey="churchStatus"
          innerRadius={70}
          outerRadius={90}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold text-3xl"
                    >
                      {query.data?.total?.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground capitalize"
                    >
                      {removeUnderscores(memberType)}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
