"use client";

import { useAction } from "next-safe-action/hooks";
import { type ComponentProps, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { SubmitButton } from "@/components/ui/submit-button";
import { useLeaders } from "@/hooks/use-leaders";
import { demoteFromPrimaryLeader } from "./actions";

interface DemoteFromPrimaryDialogProps
  extends ComponentProps<typeof AlertDialog> {
  discipleName: string;
  discipleId: string;
}

export function DemoteFromPrimaryDialog(props: DemoteFromPrimaryDialogProps) {
  const { discipleName, discipleId, ...dialogProps } = props;

  const [newLeaderId, setNewLeaderId] = useState("");

  const leadersQuery = useLeaders({ enabled: dialogProps.open });

  const action = useAction(demoteFromPrimaryLeader, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error demoting the leader`);
    },
  });

  const isBusy = action.isPending;

  const availableLeaders = leadersQuery.data?.filter(
    (l) => l.id !== discipleId,
  );

  async function handleAction() {
    if (!newLeaderId) {
      toast.error("Please select a new leader.");
      return;
    }

    try {
      const result = await action.executeAsync({
        id: discipleId,
        newLeaderId,
      });

      if (result?.data?.id) {
        toast.success(`${discipleName} was demoted to a plain disciple.`);
        setNewLeaderId("");
        props.onOpenChange?.(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setNewLeaderId("");
    }
    props.onOpenChange?.(open);
  }

  return (
    <AlertDialog {...dialogProps} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Demote Primary Leader</AlertDialogTitle>
          <AlertDialogDescription>
            This action will demote{" "}
            <strong className="text-foreground">{discipleName}</strong> from a{" "}
            <strong className="font-semibold text-blue-500">
              Primary Leader
            </strong>{" "}
            to a plain disciple.
          </AlertDialogDescription>
          <div className="rounded-md border bg-card p-4 text-sm">
            <p className="mb-2 text-foreground">
              This action will result to the following:
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>This leader will no longer be a primary leader;</li>
              <li>
                All disciples handled by this leader will remain under their
                care but their network leader will be updated to the new leader
                selected below;
              </li>
              <li>
                This disciple will be assigned to the selected new leader.
              </li>
            </ul>
          </div>
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="new-leader-select">
              Assign to new leader <span className="text-destructive">*</span>
            </Label>
            <SelectNative
              id="new-leader-select"
              value={newLeaderId}
              onChange={(e) => setNewLeaderId(e.target.value)}
              disabled={isBusy || leadersQuery.isLoading}
            >
              <option value="">
                {leadersQuery.isLoading
                  ? "Loading leaders..."
                  : "Select a leader"}
              </option>
              {availableLeaders?.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {leader.name}
                </option>
              ))}
            </SelectNative>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
          <SubmitButton
            loading={isBusy}
            onClick={handleAction}
            disabled={!newLeaderId}
          >
            Confirm
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
