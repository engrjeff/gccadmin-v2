"use client";

import { LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  textToCopy: string;
  ariaLabel?: string;
}

export function CopyButton({ textToCopy, ariaLabel }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) return;

      await navigator.clipboard.writeText(textToCopy);
      toast.info("Copied to clipboard", { richColors: false });
    } catch (error) {
      console.log("Copy Error: ", error);
      toast.error("Failed to copy");
    }
  };

  return (
    <Button size="iconSm" variant="ghost" onClick={handleCopy}>
      <LinkIcon />
      <span className="sr-only">{ariaLabel || "Copy to clipboard"}</span>
    </Button>
  );
}
