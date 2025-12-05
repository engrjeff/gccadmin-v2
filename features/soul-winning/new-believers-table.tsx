import { CheckIcon, XIcon } from "lucide-react";
import type { NewBeliever } from "@/app/generated/prisma";
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

interface ExtendedNewBeliever extends NewBeliever {
  networkLeader: { id: string; name: string } | null;
  handledBy: { id: string; name: string } | null;
  soulWinningReports: {
    lessonId: string;
  }[];
}

interface NewBelieversTableProps {
  lessons: Array<{
    id: string;
    title: string;
    lessonSeries: {
      title: string;
    };
  }>;
  isAdmin?: boolean;
  newBelievers: ExtendedNewBeliever[];
}

export function NewBelieversTable({
  lessons,
  newBelievers,
}: NewBelieversTableProps) {
  return (
    <div className="min-h-min flex-1 overflow-hidden rounded-md border [&>div]:rounded-md lg:[&>div]:max-h-[480px]">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Handled By</TableHead>
            {lessons.map((lesson) => (
              <TableHead key={lesson.id} className="text-center text-[10px]">
                <div>{lesson.title}</div>
                <div className="text-[10px] text-muted-foreground">
                  {lesson.lessonSeries.title}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {newBelievers.map((nb) => (
            <TableRow key={nb.id} className="hover:bg-transparent">
              <TableCell className="border-r">
                <p className="font-semibold">{nb.name}</p>
                <p className="text-muted-foreground text-xs capitalize">
                  {removeUnderscores(nb.memberType)}
                </p>
              </TableCell>
              <TableCell className="border-r">
                <p className="font-semibold">
                  {nb.handledBy
                    ? nb.handledBy.name
                    : nb.networkLeader?.name}{" "}
                </p>
                <p className="text-muted-foreground text-xs capitalize">
                  {nb.handledBy ? "Assistant Leader" : "Primary Leader"}
                </p>
              </TableCell>
              {lessons.map((lesson) => (
                <TableCell
                  key={`cell-${lesson.id}`}
                  className="border-r text-center"
                >
                  {nb.soulWinningReports
                    .map((n) => n.lessonId)
                    .includes(lesson.id) ? (
                    <Badge variant="ACTIVE" className="p-0 dark:bg-transparent">
                      <CheckIcon /> Taken
                    </Badge>
                  ) : (
                    <Badge variant="NACS" className="p-0 dark:bg-transparent">
                      <XIcon /> Not Taken
                    </Badge>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
