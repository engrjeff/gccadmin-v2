import { ProcessLevelStatus } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { removeUnderscores } from "@/lib/utils";

export function ProcessLevelStatusStatusBadge({
  processLevelStatus,
}: {
  processLevelStatus: ProcessLevelStatus;
}) {
  if (processLevelStatus === ProcessLevelStatus.NOT_STARTED)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-100"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  if (processLevelStatus === ProcessLevelStatus.UNFINISHED)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-200"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  if (processLevelStatus === ProcessLevelStatus.DROPPED)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-300"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  if (processLevelStatus === ProcessLevelStatus.PENDING_REQUIREMENTS)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-400"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  if (processLevelStatus === ProcessLevelStatus.ON_GOING)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-600"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  if (processLevelStatus === ProcessLevelStatus.FINISHED)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-lime-700"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevelStatus)}
      </Badge>
    );

  return null;
}
