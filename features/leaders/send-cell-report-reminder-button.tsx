"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";

type EmailPayload = { email: string; name: string };

async function sendCellReportReminderAction(data: EmailPayload[]) {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.POST_SEND_CELL_REPORT_REMINDER,
      data,
    );

    return response.data;
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <meh>
    throw error;
  }
}

export function SendCellReportReminderButton({
  data,
}: {
  data: EmailPayload[];
}) {
  const sendMutation = useMutation({
    mutationKey: ["send-cell-report-reminder"],
    mutationFn: sendCellReportReminderAction,
  });

  async function handleSend() {
    await sendMutation
      .mutateAsync(data, {
        onSuccess() {
          toast.success("Email reminders were successfully sent!");
        },
        onError(error) {
          if (isAxiosError(error)) {
            const err =
              error.response?.data?.error?.message ?? "Error sending emails.";
            toast.error(err);
          } else {
            toast.error("Error sending emails");
          }
        },
      })
      .catch((e) => console.log(e));
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleSend}
      disabled={sendMutation.isPending}
    >
      Send Reminder{" "}
      {sendMutation.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <SendHorizonalIcon />
      )}
    </Button>
  );
}
