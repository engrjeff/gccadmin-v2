"use client";

import { DownloadIcon, PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLessonsTaken } from "@/hooks/use-lessons-taken";

export function LessonsTaken() {
  const query = useLessonsTaken();

  if (query.isLoading)
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Lessons Taken</h3>
          <p className="text-sm text-muted-foreground">
            Cell group lessons from GCC Resources
          </p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-[92px] w-full" />
        </div>
      </div>
    );

  const lessonsTaken = query.data?.lessonsTaken;

  return (
    <div className="space-y-4 flex-1">
      <div>
        <h3 className="font-semibold">Lessons Taken</h3>
        <p className="text-sm text-muted-foreground">
          Cell group lessons from GCC Resources
        </p>
      </div>
      {lessonsTaken?.length === 0 ? (
        <div className="min-h-[350px] border rounded-md border-dashed flex flex-col items-center justify-center gap-3">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            No lessons taken yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {lessonsTaken?.map((lesson) => (
            <li key={lesson.id}>
              <div className="bg-card/60 border rounded-md py-3 space-y-3">
                <div className="flex items-center gap-2 px-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {lesson.lessonSeries.title}
                    </p>
                    {lesson.scriptureReferences.length === 0 ? null : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {lesson.scriptureReferences.slice(0, 4).map((sc) => (
                          <Badge
                            key={`${lesson.id}-scriptureref-${sc}`}
                            variant="MALE"
                          >
                            {sc}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-auto">
                    <Button
                      disabled={!lesson.fileUrl}
                      size="iconSm"
                      variant="ghost"
                      asChild
                    >
                      <a
                        href={lesson.fileUrl as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={lesson.title}
                        className="aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-80 aria-disabled:text-muted-foreground"
                        aria-disabled={!lesson.fileUrl}
                      >
                        <DownloadIcon />{" "}
                        <span className="sr-only">Download</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
