"use client";

import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function Announcement() {
  const [ok, setOk] = useState<string | null>(
    () => localStorage.getItem("gcc-admin-ok") as string,
  );

  useEffect(() => {
    const isOk = localStorage.getItem("gcc-admin-ok");

    if (isOk === "okay") {
      setOk("okay");
    } else {
      setOk(null);
    }
  }, []);

  if (ok === "okay") return null;

  return (
    <div className="flex items-center gap-2 border-b bg-red-500/20 px-3 py-2 text-red-500">
      <InfoIcon className="size-3 shrink-0" />
      <p className="text-sm">
        The usage of this application requires responsibility.
      </p>
      <Button
        size="sm"
        variant="destructive"
        className="ml-auto"
        onClick={() => {
          setOk("okay");
          localStorage.setItem("gcc-admin-ok", "okay");
          toast.info("Thanks!");
        }}
      >
        I understand
      </Button>
    </div>
  );
}
