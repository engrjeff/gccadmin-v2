import Link from "next/link";
import type { Disciple } from "@/app/generated/prisma";
import { SortLink } from "@/components/sort-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeUnderscores } from "@/lib/utils";
import { CellStatusBadge } from "./cell-status-badge";
import { ChurchStatusBadge } from "./church-status-badge";
import { ProcessLevelBadge } from "./process-level-badge";
import { ProcessLevelStatusStatusBadge } from "./process-level-status-badge";

export function DisciplesTable({ disciples }: { disciples: Disciple[] }) {
  return (
    <div className="[&>div]:rounded-md rounded-md border flex-1 min-h-min overflow-hidden [&>div]:max-h-[490px]">
      <Table>
        <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="size-4 text-center">#</TableHead>
            <TableHead>
              <SortLink sortValue="name" title="Name" />
            </TableHead>
            <TableHead>
              <SortLink sortValue="cellStatus" title="Cell Status" />
            </TableHead>
            <TableHead>
              <SortLink sortValue="churchStatus" title="Church Status" />
            </TableHead>
            <TableHead>
              <SortLink sortValue="processLevel" title="Process Level" />
            </TableHead>
            <TableHead>
              <SortLink sortValue="processLevelStatus" title="Process Status" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disciples.map((d, index) => (
            <TableRow key={d.id} className="hover:bg-transparent">
              <TableCell className="bg-card w-4 border-r text-center">
                {index + 1}
              </TableCell>
              <TableCell>
                <div>
                  <Link
                    href={`/disciples/${d.id}`}
                    className="font-semibold hover:underline"
                  >
                    {d.name}
                  </Link>
                  <p className="text-xs text-muted-foreground capitalize">
                    {removeUnderscores(d.memberType)}, {d.gender.toLowerCase()}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <CellStatusBadge cellStatus={d.cellStatus} />
              </TableCell>
              <TableCell>
                <ChurchStatusBadge churchStatus={d.churchStatus} />
              </TableCell>
              <TableCell>
                <ProcessLevelBadge processLevel={d.processLevel} />
              </TableCell>
              <TableCell>
                <ProcessLevelStatusStatusBadge
                  processLevelStatus={d.processLevelStatus}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
