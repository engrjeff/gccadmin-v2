import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { AttendedCellGroups } from "@/features/disciples/attended-cellgroups";
import { DiscipleDetailTabs } from "@/features/disciples/disciple-detail-tabs";
import { DiscipleDetails } from "@/features/disciples/disciple-details";
import { HandledDisciples } from "@/features/disciples/handled-disciples";
import { LessonsTaken } from "@/features/disciples/lessons-taken";
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
    title: disciple ? disciple.name : "Disciple not found",
  };
};

async function DiscipleDetailPage({ params }: PageProps) {
  const pageParams = await params;

  const { disciple } = await cachedGetDiscipleById(pageParams.discipleId);

  if (!disciple) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Link
        href="/disciples"
        className="inline-flex w-max items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeftIcon className="size-4" /> Back to List
      </Link>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">{disciple.name}</h2>
          {disciple.isPrimary ? (
            <p className="text-muted-foreground text-sm">Primary Leader</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Cell Leader: {disciple.leader?.name}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-3"></div>
      </div>
      <DiscipleDetailTabs>
        <TabsContent value="details">
          <DiscipleDetails disciple={disciple} />
        </TabsContent>
        <TabsContent value="lessons-taken">
          <LessonsTaken />
        </TabsContent>
        <TabsContent value="attended-cellgroups">
          <AttendedCellGroups />
        </TabsContent>
        <TabsContent value="handled-disciples">
          <HandledDisciples
            handledBy={disciple.name}
            disciples={
              disciple.isPrimary
                ? disciple.disciples
                : disciple.handledDisciples
            }
          />
        </TabsContent>
      </DiscipleDetailTabs>
    </div>
  );
}

export default DiscipleDetailPage;
