"use client";

import { useFormContext } from "react-hook-form";
import type { AddAttendeesInputs } from "./schema";

export function TotalAttendeesDisplay() {
  const form = useFormContext<AddAttendeesInputs>();

  const attendeesValues = form.watch("attendees").map((a) => a.id);
  const newComersValues = form.watch("newComers");
  const returneesValues = form.watch("returnees");

  const totalSoFar =
    attendeesValues.length + newComersValues.length + returneesValues.length;

  return (
    <div>
      Total: <span className="font-semibold text-green-500">{totalSoFar}</span>
    </div>
  );
}
