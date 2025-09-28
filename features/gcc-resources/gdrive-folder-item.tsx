import { ChevronRightIcon, FolderIcon } from "lucide-react";
import type { GDriveFolder } from "./types";

export function GDriveFolderItem({ folder }: { folder: GDriveFolder }) {
  return (
    <div className="group space-y-3 rounded-md border bg-card/60 py-3 hover:bg-card/80">
      <div className="flex items-start gap-2 px-3">
        <FolderIcon className="mt-0.5 size-4 shrink-0 fill-current text-amber-500" />
        <div>
          <p className="line-clamp-1 font-semibold text-sm">{folder.name}</p>
          {folder.description ? (
            <p className="line-clamp-1 text-muted-foreground text-xs">
              {folder.description}
            </p>
          ) : null}
        </div>

        <div className="ml-auto shrink-0 self-center">
          <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}
