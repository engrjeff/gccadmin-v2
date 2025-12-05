import { PackageIcon, PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataPagination } from "@/components/data-pagination";
import { Button } from "@/components/ui/button";
import { NewBelieversFilters } from "@/features/soul-winning/new-believers-filters";
import { NewBelieversTable } from "@/features/soul-winning/new-believers-table";
import {
  getNewBelievers,
  type NewBelieversQueryArgs,
} from "@/features/soul-winning/queries";

export const metadata: Metadata = {
  title: "Soul Winning > NewBelievers",
};

interface PageProps {
  searchParams: Promise<NewBelieversQueryArgs>;
}

async function NewBelieversPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { lessons, newBelievers, pageInfo, isAdmin } =
    await getNewBelievers(pageSearchParams);

  if (pageInfo.total === 0) {
    return (
      <div className="flex min-h-[350px] flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed">
        <PackageIcon className="size-6 text-muted-foreground" />
        <p className="mb-6 text-center text-muted-foreground text-sm">
          No records found. <br />
          Create a soul-winning report now.
        </p>

        <Button size="sm" asChild>
          <Link href="/soul-winning/new">
            <PlusIcon /> Create Report
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <NewBelieversFilters />
      <NewBelieversTable
        lessons={lessons}
        newBelievers={newBelievers}
        isAdmin={isAdmin}
      />
      <DataPagination name="new believers" pageInfo={pageInfo} />
    </div>
  );
}

export default NewBelieversPage;
