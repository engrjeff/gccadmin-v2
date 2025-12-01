"use client";

import { CheckIcon, LockIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import type { AddAttendeesInputs } from "./schema";

export function AttendanceChecklistSubmitButton() {
  const { formState } = useFormContext<AddAttendeesInputs>();

  if (formState.disabled) {
    return (
      <Button type="button" variant="secondaryOutline" size="sm">
        <LockIcon className="text-amber-500" /> Read-only
      </Button>
    );
  }

  return (
    <SubmitButton size="sm" loading={formState.isSubmitting}>
      <CheckIcon /> Save
    </SubmitButton>
  );
}
