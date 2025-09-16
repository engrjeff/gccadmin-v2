import { ChurchStatus } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { removeUnderscores } from "@/lib/utils";

export function ChurchStatusBadge({
  churchStatus,
}: {
  churchStatus: ChurchStatus;
}) {
  if (churchStatus === ChurchStatus.NACS)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-purple-100"
          aria-hidden="true"
        ></span>
        {removeUnderscores(churchStatus)}
      </Badge>
    );

  if (churchStatus === ChurchStatus.ACS)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-purple-300"
          aria-hidden="true"
        ></span>
        {removeUnderscores(churchStatus)}
      </Badge>
    );

  if (churchStatus === ChurchStatus.REGULAR)
    return (
      <Badge variant="secondary" className="gap-1.5 capitalize">
        <span
          className="size-1.5 rounded-full bg-purple-500"
          aria-hidden="true"
        ></span>
        {removeUnderscores(churchStatus)}
      </Badge>
    );

  return null;
}
