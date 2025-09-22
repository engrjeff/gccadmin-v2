import { PackageIcon } from "lucide-react";
import Link from "next/link";
import type { Disciple } from "@/app/generated/prisma";
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
import { DiscipleRowActions } from "./disciple-row-actions";
import { ProcessLevelBadge } from "./process-level-badge";
import { ProcessLevelStatusStatusBadge } from "./process-level-status-badge";

export function HandledDisciples({
  handledBy,
  disciples,
}: {
  handledBy: string;
  disciples: Disciple[];
}) {
  return (
    <div className="space-y-4 flex-1">
      <div>
        <h3 className="font-semibold">
          Handled Disciples ({disciples.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          List of disciples being handled by {handledBy}
        </p>
      </div>
      <div className="[&>div]:rounded-md rounded-md border min-h-min overflow-hidden [&>div]:min-h-[60vh] lg:[&>div]:max-h-[490px]">
        <Table>
          <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="size-4 text-center">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Cell Status</TableHead>
              <TableHead>Church Status</TableHead>
              <TableHead>Process Level</TableHead>
              <TableHead>Process Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciples.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7}>
                  <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
                    <PackageIcon className="size-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      No disciples being handled yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              disciples.map((d, index) => (
                <TableRow key={d.id} className="hover:bg-transparent">
                  <TableCell className="w-4 border-r text-center">
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
                        {removeUnderscores(d.memberType)},{" "}
                        {d.gender.toLowerCase()}
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
                  <TableCell className="text-center">
                    <DiscipleRowActions disciple={d} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
