"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import type { AddAttendeesInputs } from "./schema";

export function AttendanceCheckField({ memberId }: { memberId: string }) {
  const form = useFormContext<AddAttendeesInputs>();

  const attendeesValues = form.watch("attendees").map((a) => a.id);

  return (
    <label
      htmlFor={`attendee-${memberId}`}
      className="inline-flex size-full h-9 cursor-pointer items-center justify-center text-center hover:bg-card"
    >
      <Checkbox
        name={`attendee-${memberId}`}
        id={`attendee-${memberId}`}
        checked={attendeesValues.includes(memberId)}
        className="cursor-pointer data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500"
        onCheckedChange={(checked) => {
          if (checked === true) {
            form.setValue("attendees", [
              ...form.getValues("attendees"),
              { id: memberId },
            ]);
          } else {
            form.setValue(
              "attendees",
              form.getValues("attendees").filter((a) => a.id !== memberId),
            );
          }
        }}
      />
    </label>
  );
}
