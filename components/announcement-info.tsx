import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function AnnouncementInfo() {
  return (
    <div className="gap-2 space-y-2 border-b bg-secondary px-3 py-2">
      <p className="text-sm">
        <span>🍀</span>Soul Winning & Consolidation Module is live!{" "}
      </p>
      <Button size="sm" variant="link" className="px-0 text-blue-500" asChild>
        <Link href="/soul-winning/new">
          Create Report <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  );
}
