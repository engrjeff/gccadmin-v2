import { DownloadIcon, FileIcon } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { formatDateDistance } from "@/lib/utils";
import type { GDriveFile } from "./types";

export function GDriveFileItem({ file }: { file: GDriveFile }) {
  return (
    <div className="space-y-3 rounded-md border bg-card/60 py-3">
      <div className="flex items-start gap-2 px-3">
        <FileIcon className="mt-0.5 size-4 shrink-0 fill-current text-blue-500" />
        <div>
          {file.webViewLink ? (
            <a href={file.webViewLink} target="_blank" rel="noreferrer">
              <p className="line-clamp-1 font-semibold text-sm hover:underline">
                {file.name}
              </p>
            </a>
          ) : (
            <p className="line-clamp-1 font-semibold text-sm">{file.name}</p>
          )}

          {file.createdTime ? (
            <p className="line-clamp-1 text-muted-foreground text-xs">
              {formatDateDistance(file.createdTime)}
            </p>
          ) : null}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 self-end">
          {file.webViewLink ? (
            <CopyButton
              textToCopy={file.webViewLink}
              ariaLabel={`Copy link to ${file.name}`}
            />
          ) : null}
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
