"use client";

import { ShieldIcon } from "lucide-react";
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

  return (
    <FilterField
      label={label}
      queryName={queryName}
      singleSelection
      Icon={ShieldIcon}
      useLabelDisplay
      options={
        assistantLeadersQuery.data?.map((assistant) => ({
          value: assistant.id,
          label: assistant.name,
        })) ?? []
      }
    />
  );
}
