import pluralize from "pluralize";
import type { Lesson, LessonSeries } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LessonCard } from "./lesson-card";
import { LessonFormDialog } from "./lesson-form-dialog";
import { LessonSeriesEditFormDialog } from "./lesson-series-edit-form-dialog";

export function LessonSeriesCard({
  lessonSeries,
}: {
  lessonSeries: LessonSeries & { lessons: Lesson[] };
}) {
  return (
    <Card className="h-full py-4 relative gap-3">
      <CardHeader className="px-4">
        <CardTitle>{lessonSeries.title}</CardTitle>
        <CardDescription>{lessonSeries.description}</CardDescription>
      </CardHeader>
      <CardAction className="absolute top-1 right-1">
        <LessonSeriesEditFormDialog lessonSeries={lessonSeries} />
        <LessonFormDialog lessonSeries={lessonSeries} />
      </CardAction>
      <CardContent className="px-4">
        {lessonSeries.tags.length === 0 ? null : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {lessonSeries.tags.map((tag) => (
              <Badge key={`${lessonSeries.id}-tag-${tag}`} variant="NONE">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" disabled={lessonSeries.lessons.length === 0}>
              {lessonSeries.lessons.length === 0
                ? "No lessons yet"
                : `View ${lessonSeries.lessons.length}
          ${pluralize("lesson", lessonSeries.lessons.length)}`}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
          >
            <SheetHeader className="border-b p-4 text-left">
              <SheetTitle>{lessonSeries.title}</SheetTitle>
              <SheetDescription>
                Lessons in {lessonSeries.title}
              </SheetDescription>
            </SheetHeader>
            <ul className="p-4 space-y-3 max-h-[calc(100%-88px)] overflow-y-auto">
              {lessonSeries.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonCard lesson={lesson} />
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
