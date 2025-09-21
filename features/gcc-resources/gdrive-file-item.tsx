import { DownloadIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateDistance } from "@/lib/utils";
import type { GDriveFile } from "./types";

export function GDriveFileItem({ file }: { file: GDriveFile }) {
  return (
    <div className="bg-card/60 border rounded-md py-3 space-y-3">
      <div className="flex items-center gap-2 px-3">
        <div className="flex items-start gap-2">
          <FileIcon className="text-blue-500 size-4 fill-current mt-0.5" />
          <div>
            {file.webViewLink ? (
              <a href={file.webViewLink} target="_blank" rel="noreferrer">
                <p className="text-sm font-semibold hover:underline">
                  {file.name}
                </p>
              </a>
            ) : (
              <p className="text-sm font-semibold">{file.name}</p>
            )}

            {file.createdTime ? (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {formatDateDistance(file.createdTime)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="ml-auto">
          {file.webContentLink ? (
            <Button size="iconSm" variant="ghost" asChild>
              <a
                href={file.webContentLink}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
                <span className="sr-only">Download {file.name}</span>
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
