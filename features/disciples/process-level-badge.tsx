import { ProcessLevel } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { removeUnderscores } from "@/lib/utils";

export function ProcessLevelBadge({
  processLevel,
}: {
  processLevel: ProcessLevel;
}) {
  if (processLevel === ProcessLevel.NONE)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-100"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  if (processLevel === ProcessLevel.PREENC)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-300"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  if (processLevel === ProcessLevel.ENCOUNTER)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-500"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  if (processLevel === ProcessLevel.LEADERSHIP_1)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-700"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  if (processLevel === ProcessLevel.LEADERSHIP_2)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-700"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  if (processLevel === ProcessLevel.LEADERSHIP_3)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-amber-700"
          aria-hidden="true"
        ></span>
        {removeUnderscores(processLevel)}
      </Badge>
    );

  return null;
}
