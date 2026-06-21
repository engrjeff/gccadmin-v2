import { PackageIcon } from "lucide-react";
import Link from "next/link";
import type { NewComer } from "@/app/generated/prisma";
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

interface NewChurchAttendee extends NewComer {
  invitedBy: {
    name: string;
    id: string;
    leader: {
      name: string;
      id: string;
    } | null;
  } | null;
  attendances: {
    id: string;
  }[];
}

function getAttendanceStatus(attendanceCount: number) {
  if (attendanceCount >= 4) return "Regular";

  if (attendanceCount === 3) return "3rd Timer";

  if (attendanceCount === 2) return "2nd Timer";

  if (attendanceCount === 1) return "1st Timer";
}

export function NewAttendeeesTable({
  newChurchAttendees,
}: {
  newChurchAttendees: NewChurchAttendee[];
}) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="table-fixed lg:table-auto">
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-6 text-center">#</TableHead>
            <TableHead className="w-56 lg:w-auto">Name</TableHead>
            <TableHead className="w-56">Invited By</TableHead>
            <TableHead className="w-56">Network</TableHead>
            <TableHead className="w-9 text-center">Status</TableHead>
            <TableHead className="w-32 text-center">Contact No.</TableHead>
            <TableHead className="w-36">Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newChurchAttendees?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6}>
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-center text-muted-foreground text-sm">
                    No record for new comers found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            newChurchAttendees?.map((newComer, index) => (
              <TableRow key={newComer.id}>
                <TableCell className="w-4 border-r text-center">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{newComer.name}</p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {removeUnderscores(newComer.memberType)},{" "}
                      {newComer.gender.toLowerCase()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {newComer.invitedBy ? (
                    <Link
                      href={`/disciples/${newComer.invitedById}`}
                      className="hover:underline"
                    >
                      {newComer.invitedBy.name}
                    </Link>
                  ) : (
                    <span>Walk-in</span>
                  )}
                </TableCell>
                <TableCell>
                  {newComer.invitedBy?.leader ? (
                    <Link
                      href={`/disciples/${newComer.invitedBy.leader.id}`}
                      className="hover:underline"
                    >
                      {newComer.invitedBy.leader.name}
                    </Link>
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="ACTIVE">
                    {getAttendanceStatus(newComer.attendances.length)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {newComer.contactNo ?? "--"}
                </TableCell>
                <TableCell>
                  <p className="whitespace-nowrap">{newComer.address}</p>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
