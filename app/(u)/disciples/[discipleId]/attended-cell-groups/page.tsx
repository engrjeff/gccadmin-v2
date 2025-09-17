import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TabLink } from "@/components/ui/tab-link";
import { cachedGetDiscipleById } from "@/features/disciples/queries";

interface PageProps {
  params: Promise<{ discipleId: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const pageParams = await params;

  const { disciple } = await cachedGetDiscipleById(pageParams.discipleId);

  return {
    title: disciple
      ? `${disciple.name} - Attended Cell Groups`
      : "Disciple not found",
  };
};

async function DiscipleAttendedCellGroupsPage({ params }: PageProps) {
  const pageParams = await params;

  const { disciple } = await cachedGetDiscipleById(pageParams.discipleId);

  if (!disciple) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Link
        href="/disciples"
        className="text-sm inline-flex w-max items-center gap-2 hover:underline"
      >
        <ArrowLeftIcon className="size-4" /> Back to List
      </Link>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">{disciple.name}</h2>
          {disciple.isPrimary ? (
            <p className="text-sm text-muted-foreground">Primary Leader</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3 ml-auto"></div>
      </div>
      <div className="border-b">
        <TabLink href={`/disciples/${disciple.id}`}>Details</TabLink>
        <TabLink href={`/disciples/${disciple.id}/attended-cell-groups`}>
          Cell Groups
        </TabLink>
        <TabLink href={`/disciples/${disciple.id}/lessons-taken`}>
          Lessons Taken
        </TabLink>
        <TabLink href={`/disciples/${disciple.id}/handled-disciples`}>
          Handled Disciples
        </TabLink>
      </div>
      <div className="flex-1 space-y-4"></div>
    </div>
  );
}

export default DiscipleAttendedCellGroupsPage;
