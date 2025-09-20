import type { Metadata } from "next";
import { DataPagination } from "@/components/data-pagination";
import { DiscipleCreateFormModal } from "@/features/disciples/disciple-create-form-modal";
import { DisciplesFilters } from "@/features/disciples/disciples-filters";
import { DisciplesTable } from "@/features/disciples/disciples-table";
import { ImportDisciplesDialog } from "@/features/disciples/import-disciples-dialog";
import {
  type DisciplesQueryArgs,
  getDisciples,
} from "@/features/disciples/queries";

export const revalidate = 3600; // revalidate at most every hour

export const metadata: Metadata = {
  title: "Disciples",
};

interface PageProps {
  searchParams: Promise<DisciplesQueryArgs>;
}

export default async function DisciplesPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { disciples, pageInfo, isAdmin } = await getDisciples(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <h2 className="font-bold">Disciples</h2>
        <div className="flex items-center gap-3 ml-auto">
          <ImportDisciplesDialog />
          <DiscipleCreateFormModal />
        </div>
      </div>
      <DisciplesFilters />
      <DisciplesTable isAdmin={isAdmin} disciples={disciples} />
      <DataPagination name="disciples" pageInfo={pageInfo} />
    </div>
  );
}
