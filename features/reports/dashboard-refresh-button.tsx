"use client";

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardRefreshButton() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={Boolean(isFetching)}
      onClick={() => queryClient.refetchQueries()}
    >
      <RefreshCwIcon className={isFetching ? "animate-spin" : ""} /> Refresh
    </Button>
  );
}
