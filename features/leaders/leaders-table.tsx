import Link from "next/link";
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
import { LeaderRowActions } from "./leader-row-actions";

export function LeadersTable({
  leaders,
}: {
  leaders: Array<Disciple & { userAccount: User | null }>;
}) {
  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-card bg-card">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead className="text-center">Disciples</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaders.map((leader, index) => (
            <TableRow key={leader.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">
                <Link href={`/leaders/${leader.id}`}>{leader.name}</Link>
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
                  <Badge variant="ACTIVE">Account linked</Badge>
                ) : (
                  <Badge variant="outline">No account</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={leader.gender}>{leader.gender}</Badge>
              </TableCell>
              <TableCell className="text-center">{12}</TableCell>
              <TableCell className="text-center">
                <LeaderRowActions leader={leader} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
