"use client";

import { CheckIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDisciples } from "@/hooks/use-disciples";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { cn } from "@/lib/utils";
import type { CellReportCreateInputs } from "./schema";

export function AttendeesPicker() {
  const cellReportForm = useFormContext<CellReportCreateInputs>();

  const isAdmin = useIsAdmin();
  const leaderId = cellReportForm.watch("leaderId");
  const assistantId = cellReportForm.watch("assistantId");
  const attendees = cellReportForm.watch("attendees");

  const [attendeesSearchQuery, setAttendeesSearchQuery] = useState("");
  const [selectedShown, setSelectedShown] = useState(false);

  const disciplesOfLeader = useDisciples({ leaderId });

  const selectedAttendees = disciplesOfLeader.data?.filter((d) =>
    attendees.includes(d.id),
  );

  const unSelectedAttendees = disciplesOfLeader.data?.filter(
    (d) =>
      !attendees.includes(d.id) &&
      d.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase()),
  );

  const handleAttendeesSelection = (attendeeId: string) => {
    const updatedAttendees = attendees.includes(attendeeId)
      ? attendees.filter((i) => i !== attendeeId)
      : [...attendees, attendeeId];

    cellReportForm.setValue("attendees", updatedAttendees);
  };

  const handleSelectAll = () => {
    cellReportForm.setValue(
      "attendees",
      disciplesOfLeader.data?.map((d) => d.id) ?? [],
    );
  };

  const handleDeselectAll = () => {
    cellReportForm.setValue("attendees", []);
  };

  if (isAdmin && !leaderId)
    return (
      <div className="relative min-h-[300px] rounded-md border">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-center text-muted-foreground text-sm">
            Select a leader first
          </p>
        </div>
      </div>
    );

  if (disciplesOfLeader?.isLoading)
    return (
      <div className="relative min-h-[300px] rounded-md border">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2Icon
            size={32}
            className="animate-spin text-muted-foreground"
          />
          <p className="text-center text-muted-foreground text-sm">
            Getting disciples data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative overflow-hidden rounded-md border">
      <div className="sticky top-0 bg-background p-2">
        <div className="relative">
          <Input
            aria-label="Search attendees"
            placeholder={
              disciplesOfLeader.data?.length === 0
                ? "No disciple data"
                : "Search here"
            }
            value={attendeesSearchQuery}
            disabled={disciplesOfLeader.data?.length === 0}
            onChange={(e) => setAttendeesSearchQuery(e.currentTarget.value)}
            className="peer h-10 ps-9 pe-9 lg:h-9"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <SearchIcon size={16} strokeWidth={2} />
          </div>

          {attendeesSearchQuery ? (
            <button
              type="button"
              className="-translate-y-1/2 absolute top-1/2 right-1 inline-flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setAttendeesSearchQuery("")}
            >
              <XIcon size={16} />
            </button>
          ) : null}
        </div>
        {disciplesOfLeader.data?.length === 0 && disciplesOfLeader.isSuccess ? (
          <div className="py-2">
            <p className="mt-1 text-center text-muted-foreground text-sm">
              No disciple found for the selected leader.
            </p>
          </div>
        ) : null}
      </div>

      {attendees.length ? (
        <section className="mb-6 border-t">
          <div className="flex items-center justify-between border-b bg-muted/20 px-2.5 py-1">
            <Button
              type="button"
              size="sm"
              variant="link"
              className="px-0 text-blue-500 no-underline"
              onClick={() => setSelectedShown((state) => !state)}
            >
              {selectedShown ? "Hide" : "View"} Selected ({attendees.length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant="link"
              className="text-blue-500 no-underline"
              onClick={handleDeselectAll}
            >
              Deselect All
            </Button>
          </div>
          {selectedShown ? (
            <ul className="max-h-[300px] w-full overflow-y-auto">
              {selectedAttendees?.map((d) => (
                <li key={`attendee-${d.id}`} className="border-b">
                  <button
                    title="click to deselect"
                    type="button"
                    disabled={assistantId === d.id}
                    onClick={() => handleAttendeesSelection(d.id)}
                    className={cn(
                      "inline-flex w-full items-center justify-between p-2.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent",
                      attendees.includes(d.id) ? "bg-muted/30" : "",
                    )}
                  >
                    <span className="text-foreground text-sm">{d.name}</span>
                    <CheckIcon size={16} className="text-green-500" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {attendeesSearchQuery && !unSelectedAttendees?.length ? (
        <div className="flex flex-col items-center justify-center gap-2 pt-2 pb-6">
          <p className="text-center text-muted-foreground text-sm">{`No unselected disciple found for keyword : "${attendeesSearchQuery}"`}</p>
        </div>
      ) : null}

      {unSelectedAttendees?.length ? (
        <section className="border-t">
          <div className="flex items-center justify-between border-b bg-muted/20 px-2.5 py-1">
            <h3 className="font-medium text-xs">Disciples</h3>
            <Button
              type="button"
              size="sm"
              variant="link"
              className="text-blue-500 no-underline"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
          </div>
          <ul className="max-h-[300px] w-full divide-y overflow-y-auto">
            {unSelectedAttendees?.map((d) => (
              <li key={`attendee-${d.id}`}>
                <button
                  title="click to select"
                  type="button"
                  onClick={() => handleAttendeesSelection(d.id)}
                  className={cn(
                    "inline-flex w-full items-center justify-between p-2.5 transition-colors hover:bg-muted",
                    attendees.includes(d.id) ? "bg-muted/30" : "",
                  )}
                >
                  <span className="text-muted-foreground text-sm">
                    {d.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
