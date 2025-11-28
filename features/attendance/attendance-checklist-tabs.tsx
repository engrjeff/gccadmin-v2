"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Gender } from "@/app/generated/prisma";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export function AttendanceChecklistTabs() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <div className="flex items-center gap-3">
        <Label htmlFor="view">View</Label>
        <Select
          value={searchParams.get("view") ?? "Leaders"}
          onValueChange={(value) =>
            router.push(`/attendance/${params.id}?view=${value}`)
          }
        >
          <SelectTrigger
            id="view"
            className="flex **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate md:hidden"
            size="sm"
            aria-label="Select view"
          >
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Leaders">Leaders</SelectItem>
            <SelectItem value={Gender.MALE}>Male</SelectItem>
            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
            <SelectItem value="Returnees">Returnees</SelectItem>
            <SelectItem value="NewComers">New Comers</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );

  return (
    <Tabs
      value={searchParams.get("view") ?? "Leaders"}
      onValueChange={(value) =>
        router.push(`/attendance/${params.id}?view=${value}`)
      }
    >
      <TabsList>
        <TabsTrigger value="Leaders">Leaders</TabsTrigger>
        <TabsTrigger value={Gender.MALE}>Male</TabsTrigger>
        <TabsTrigger value={Gender.FEMALE}>Female</TabsTrigger>
        <TabsTrigger value="Returnees">Returnees</TabsTrigger>
        <TabsTrigger value="NewComers">New Comers</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
