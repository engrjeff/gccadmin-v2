"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const disciplePages = [
  {
    id: "details",
    label: "Details",
  },
  {
    id: "lessons-taken",
    label: "Lessons Taken",
  },
  {
    id: "attended-cellgroups",
    label: "Cell Groups",
  },
  {
    id: "handled-disciples",
    label: "Handled Disciples",
  },
];

const discipleMobilePages = [
  {
    id: "details",
    label: "Details",
  },
  {
    id: "lessons-taken",
    label: "Lessons",
  },
  {
    id: "attended-cellgroups",
    label: "Cell Groups",
  },
  {
    id: "handled-disciples",
    label: "Disciples",
  },
];

export function DiscipleDetailTabs({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams<{ discipleId: string }>();
  const router = useRouter();

  const tab = searchParams.get("tab") ?? disciplePages[0].id;

  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Tabs
        defaultValue={tab}
        value={tab}
        onValueChange={(value) =>
          router.push(`/disciples/${params.discipleId}?tab=${value}`)
        }
      >
        <TabsList className="sticky top-0 justify-start bg-background z-10 text-foreground h-auto gap-2 rounded-none border-b w-full px-0 py-1">
          {discipleMobilePages.map((page) => (
            <TabsTrigger
              key={page.id}
              value={page.id}
              className="hover:bg-accent flex-0 dark:data-[state=active]:text-primary hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative inline-flex after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
            >
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    );

  return (
    <Tabs
      defaultValue={tab}
      value={tab}
      onValueChange={(value) =>
        router.push(`/disciples/${params.discipleId}?tab=${value}`)
      }
    >
      <TabsList className="sticky top-0 justify-start bg-background z-10 text-foreground h-auto gap-2 rounded-none border-b w-full px-0 py-1">
        {disciplePages.map((page) => (
          <TabsTrigger
            key={page.id}
            value={page.id}
            className="hover:bg-accent flex-0 dark:data-[state=active]:text-primary hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative inline-flex after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
          >
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
