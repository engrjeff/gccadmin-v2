"use client";

import { CheckIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { AddAttendeesInputs } from "./schema";

export function AttendanceChecklistSubmitButton() {
  const { formState } = useFormContext<AddAttendeesInputs>();

  return (
    <SubmitButton size="sm" loading={formState.isSubmitting}>
      <CheckIcon /> Save
    </SubmitButton>
  );
}
