"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Gender } from "@/app/generated/prisma";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AttendanceChecklist() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Tabs
      value={searchParams.get("view") ?? Gender.MALE}
      onValueChange={(value) =>
        router.push(`/attendance/${params.id}?view=${value}`)
      }
    >
      <TabsList>
        <TabsTrigger value={Gender.MALE}>Male</TabsTrigger>
        <TabsTrigger value={Gender.FEMALE}>Female</TabsTrigger>
        <TabsTrigger value="NewComers">New Comers</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
