import { BadgeCheckIcon, PackageIcon, ShieldCheckIcon } from "lucide-react";
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
import { DiscipleRowActions } from "./disciple-row-actions";
import { ProcessLevelBadge } from "./process-level-badge";
import { ProcessLevelStatusStatusBadge } from "./process-level-status-badge";

export function DisciplesTable({
  isAdmin,
  disciples,
}: {
  isAdmin: boolean;
  disciples: Array<Disciple & { leader: { id: string; name: string } | null }>;
}) {
  return (
    <div className="[&>div]:rounded-md rounded-md border min-h-min overflow-hidden lg:[&>div]:max-h-[490px]">
      <Table>
        <TableHeader className="bg-card sticky top-0 z-10 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="size-4 text-center">#</TableHead>
            <TableHead>
              <SortLink sortValue="name" title="Name" />
            </TableHead>
            {isAdmin ? (
              <TableHead>
                <SortLink sortValue="leader" title="Leader" />
              </TableHead>
            ) : null}
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
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disciples.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={isAdmin ? 8 : 7}>
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    No disciple records found.
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
                      className="font-semibold hover:underline inline-flex items-center gap-1.5"
                    >
                      {d.name}{" "}
                      {d.isMyPrimary && !d.isPrimary ? (
                        <BadgeCheckIcon className="size-3 text-blue-500" />
                      ) : null}
                      {d.isPrimary ? (
                        <ShieldCheckIcon className="size-3 text-yellow-500" />
                      ) : null}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">
                      {removeUnderscores(d.memberType)},{" "}
                      {d.gender.toLowerCase()}
                    </p>
                  </div>
                </TableCell>
                {isAdmin ? (
                  <TableCell>
                    <Link
                      href={`/leaders/${d.leader?.id}`}
                      className="hover:underline"
                    >
                      {d.leader?.name}
                    </Link>
                  </TableCell>
                ) : null}
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
  );
}
