"use client";

import { ShieldIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAssistantLeaders } from "@/hooks/use-assistant-leaders";
import { FilterField } from "./filter-field";

export function AssistantLeadersFilter({
  label,
  queryName,
}: {
  label: string;
  queryName: string;
}) {
  const assistantLeadersQuery = useAssistantLeaders();

  const searchparams = useSearchParams();

  const leaderQuery = searchparams.get("leader") ?? undefined;

  const options = leaderQuery
    ? assistantLeadersQuery.data
        ?.filter((a) => a.leaderId === leaderQuery)
        .map((assistant) => ({
          value: assistant.id,
          label: assistant.name,
        }))
    : assistantLeadersQuery.data?.map((assistant) => ({
        value: assistant.id,
        label: assistant.name,
      }));

  if (!options?.length) return null;

  return (
    <FilterField
      label={label}
      queryName={queryName}
      singleSelection
      Icon={ShieldIcon}
      useLabelDisplay
      options={options ?? []}
    />
  );
}
