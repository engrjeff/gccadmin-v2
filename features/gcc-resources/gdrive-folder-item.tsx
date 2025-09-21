import { ChevronRightIcon, FolderIcon } from "lucide-react";
import type { GDriveFolder } from "./types";

export function GDriveFolderItem({ folder }: { folder: GDriveFolder }) {
  return (
    <div className="bg-card/60 border rounded-md py-3 space-y-3 hover:bg-card/80 group">
      <div className="flex items-center gap-2 px-3">
        <div className="flex items-start gap-2">
          <FolderIcon className="text-amber-500 size-4 fill-current mt-0.5" />
          <div>
            <p className="text-sm font-semibold">{folder.name}</p>
            {folder.description ? (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {folder.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="ml-auto">
          <ChevronRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
