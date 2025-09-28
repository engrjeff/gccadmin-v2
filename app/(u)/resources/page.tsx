import { PackageIcon } from "lucide-react";
import type { Metadata } from "next";
import { SearchField } from "@/components/ui/search-field";
import { LessonSeriesCard } from "@/features/resources/lesson-series-card";
import { LessonSeriesFormDialog } from "@/features/resources/lesson-series-form-dialog";
import {
  getLessonSeries,
  type LessonSeriesQueryArgs,
} from "@/features/resources/queries";

export const metadata: Metadata = {
  title: "Resources",
};

interface PageProps {
  searchParams: Promise<LessonSeriesQueryArgs>;
}

async function ResourcesPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const lessonSeriesList = await getLessonSeries(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Resources</h2>
          <p className="text-muted-foreground text-sm">Cell Group lessons</p>
        </div>
        {lessonSeriesList.length === 0 ? null : (
          <div className="ml-auto flex items-center gap-3">
            <LessonSeriesFormDialog />
          </div>
        )}
      </div>

      {lessonSeriesList.length === 0 ? (
        <div className="flex min-h-[350px] flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-center text-muted-foreground text-sm">
            No lesson records found.
          </p>

          <LessonSeriesFormDialog />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <SearchField paramName="q" />
          </div>
          <ul className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lessonSeriesList.map((lessonSeries) => (
              <li key={`lesson-series-${lessonSeries.id}`}>
                <LessonSeriesCard lessonSeries={lessonSeries} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ResourcesPage;
