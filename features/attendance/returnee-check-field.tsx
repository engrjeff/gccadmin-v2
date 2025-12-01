"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import type { AddAttendeesInputs } from "./schema";

export function ReturneeCheckField({ memberId }: { memberId: string }) {
  const form = useFormContext<AddAttendeesInputs>();

  const returneesValues = form.watch("returnees").map((a) => a.id);

  return (
    <Controller
      control={form.control}
      name="returnees"
      render={({ field }) => {
        return (
          <label
            htmlFor={`returnee-${memberId}`}
            className="inline-flex size-full h-9 cursor-pointer items-center justify-center text-center hover:bg-card"
          >
            <Checkbox
              disabled={form.formState.disabled}
              name={`returnee-${memberId}`}
              id={`returnee-${memberId}`}
              checked={returneesValues.includes(memberId)}
              className="cursor-pointer data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500"
              onCheckedChange={(checked) => {
                if (checked === true) {
                  field.onChange([
                    ...form.getValues("returnees"),
                    { id: memberId },
                  ]);
                } else {
                  field.onChange(
                    form
                      .getValues("returnees")
                      .filter((a) => a.id !== memberId),
                  );
                }
              }}
            />
          </label>
        );
      }}
    />
  );
}
