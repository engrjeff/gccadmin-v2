import { CheckIcon, PackageIcon, XIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import type { Disciple, User } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeUnderscores } from "@/lib/utils";
import { LeaderRowActions } from "./leader-row-actions";

export function LeadersTable({
  leaders,
}: {
  leaders: Array<
    Disciple & { userAccount: User | null; _count: { disciples: number } }
  >;
}) {
  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Account Status</TableHead>

            <TableHead className="text-center">Disciples</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaders.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}>
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-center text-muted-foreground text-sm">
                    No leader found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            leaders.map((leader, index) => (
              <TableRow key={leader.id} className="hover:bg-transparent">
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div>
                    <Link
                      href={`/leaders/${leader.id}`}
                      className="hover:underline"
                    >
                      {leader.name}
                    </Link>
                    <p className="text-muted-foreground text-xs capitalize">
                      {removeUnderscores(leader.memberType)},{" "}
                      {leader.gender.toLowerCase()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {leader.userAccount ? (
                    leader.userAccount.email
                  ) : (
                    <span className="text-muted-foreground">
                      No account linked yet.
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {leader.userAccount ? (
                    <Badge variant="ACTIVE">
                      <CheckIcon /> Account linked
                    </Badge>
                  ) : (
                    <Badge variant="INACTIVE">
                      <XIcon />
                      Unregistered
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {leader._count.disciples === 0 ? (
                    <Badge variant="outline">No disciples yet</Badge>
                  ) : (
                    <Badge variant="ACTIVE" className="normal-case">
                      {leader._count.disciples}{" "}
                      {pluralize("disciple", leader._count.disciples)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <LeaderRowActions leader={leader} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
