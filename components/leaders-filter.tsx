"use client";

import { useUser } from "@clerk/nextjs";
import { ShieldIcon } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import { FilterField } from "./filter-field";

export function LeadersFilter({ isForPastor }: { isForPastor?: boolean }) {
  const isAdmin = useIsAdmin();

  const user = useUser();

  const leadersQuery = useLeaders({ enabled: isAdmin || isForPastor });

  if (!isAdmin && !isForPastor) return null;

  return (
    <FilterField
      label="Leader"
      queryName="leader"
      singleSection
      Icon={ShieldIcon}
      useLabelDisplay
      options={
        leadersQuery.data?.map((leader) => ({
          value: leader.id,
          label:
            user?.user?.id === leader.userAccountId
              ? `${leader.name} (me)`
              : leader.name,
        })) ?? []
      }
    />
  );
}
