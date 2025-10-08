import { MemberType } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";

export function MemberTypeBadge({ memberType }: { memberType: MemberType }) {
  if (memberType === MemberType.KIDS)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-100"
          aria-hidden="true"
        ></span>
        Kids
      </Badge>
    );

  if (memberType === MemberType.YOUTH)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-300"
          aria-hidden="true"
        ></span>
        Youth
      </Badge>
    );

  if (memberType === MemberType.YOUNGPRO)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-500"
          aria-hidden="true"
        ></span>
        Young Pro
      </Badge>
    );

  if (memberType === MemberType.MEN)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-700"
          aria-hidden="true"
        ></span>
        Men
      </Badge>
    );

  if (memberType === MemberType.WOMEN)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-900"
          aria-hidden="true"
        ></span>
        Women
      </Badge>
    );

  if (memberType === MemberType.UNCATEGORIZED)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-white"
          aria-hidden="true"
        ></span>
        Youth
      </Badge>
    );
}
