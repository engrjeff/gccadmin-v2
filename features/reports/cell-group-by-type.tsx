"use client";

import pluralize from "pluralize";
import { type CellReport, CellType } from "@/app/generated/prisma";

export function CellGroupByType({
  dateRangeLabel,
  cellReports,
}: {
  dateRangeLabel: string;
  cellReports: CellReport[];
}) {
  const openCell = cellReports?.filter((cg) => cg.type === CellType.OPEN);

  const discipleshipCell = cellReports?.filter(
    (cg) => cg.type === CellType.DISCIPLESHIP,
  );

  const soulwinning = cellReports?.filter(
    (cg) => cg.type === CellType.SOULWINNING,
  );

  const count = {
    openCell: openCell?.length ?? 0,
    discipleshipCell: discipleshipCell?.length ?? 0,
    soulwinning: soulwinning?.length ?? 0,
  };

  function calcPercent(input: number) {
    if (!cellReports?.length) return 0;

    return (input / cellReports?.length) * 100;
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center">
        <p className="font-semibold text-sm">Reported Cell Groups</p>
        {/* {trend ? (
          <Badge
            variant={trend.status === "increased" ? "ACTIVE" : "INACTIVE"}
            className="ml-2 px-1"
          >
            {trend?.status === "increased" ? "+" : "-"}
            {trend?.value.toFixed(1)}%
          </Badge>
        ) : null} */}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-gray-900 text-xl dark:text-gray-50">
          {cellReports.length}
        </span>
        <span className="text-gray-500 text-sm">
          Cell {pluralize("Group", cellReports.length)} {dateRangeLabel}
        </span>
      </div>
      <div className="flex w-full items-center gap-1 rounded-full bg-muted/30 [&>*]:h-2">
        <div
          className="h-full bg-blue-500"
          style={{
            width: `${calcPercent(count.discipleshipCell)}%`,
          }}
        ></div>
        <div
          className="h-full bg-rose-500"
          style={{
            width: `${calcPercent(count.openCell)}%`,
          }}
        ></div>

        <div
          className="h-full bg-yellow-500"
          style={{
            width: `${calcPercent(count.soulwinning)}%`,
          }}
        ></div>
      </div>
      <ul className="mt-auto flex items-center justify-between">
        <li className="flex flex-col gap-2 text-xs">
          <span className="font-bold text-base">
            {calcPercent(count.discipleshipCell).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-blue-500" aria-hidden="true"></span>
            <span className="text-gray-900 dark:text-gray-50">
              Discipleship ({count.discipleshipCell})
            </span>
          </div>
        </li>
        <li className="flex flex-col gap-2 text-xs">
          <span className="font-bold text-base">
            {calcPercent(count.openCell).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-rose-500" aria-hidden="true"></span>
            <span className="text-gray-900 dark:text-gray-50">
              Open ({count.openCell})
            </span>
          </div>
        </li>
        <li className="flex flex-col gap-2 text-xs">
          <span className="font-bold text-base">
            {calcPercent(count.soulwinning).toFixed(1)}%
          </span>
          <div className="flex items-center gap-2">
            <span className="size-2.5 bg-yellow-500" aria-hidden="true"></span>
            <span className="text-gray-900 dark:text-gray-50">
              Soul Winning ({count.soulwinning})
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}
