import { CellStatus } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { removeUnderscores } from "@/lib/utils";

export function CellStatusBadge({ cellStatus }: { cellStatus: CellStatus }) {
  if (cellStatus === CellStatus.FIRST_TIMER)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-emerald-100"
          aria-hidden="true"
        ></span>
        {removeUnderscores(cellStatus)}
      </Badge>
    );

  if (cellStatus === CellStatus.SECOND_TIMER)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-emerald-300"
          aria-hidden="true"
        ></span>
        {removeUnderscores(cellStatus)}
      </Badge>
    );

  if (cellStatus === CellStatus.THIRD_TIMER)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-emerald-500"
          aria-hidden="true"
        ></span>
        {removeUnderscores(cellStatus)}
      </Badge>
    );

  if (cellStatus === CellStatus.REGULAR)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-emerald-700"
          aria-hidden="true"
        ></span>
        {removeUnderscores(cellStatus)}
      </Badge>
    );

  return null;
}
