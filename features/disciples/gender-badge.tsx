import { Gender } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";

export function GenderBadge({ gender }: { gender: Gender }) {
  if (gender === Gender.MALE)
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span
          className="size-1.5 rounded-full bg-blue-500"
          aria-hidden="true"
        ></span>
        Male
      </Badge>
    );

  return (
    <Badge variant="secondary" className="gap-1.5">
      <span
        className="size-1.5 rounded-full bg-rose-500"
        aria-hidden="true"
      ></span>
      Female
    </Badge>
  );
}
