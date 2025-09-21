"use client";

import { FolderIcon, LightbulbIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import pluralize from "pluralize";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchField } from "@/components/ui/search-field";
import { GDriveFileItem } from "./gdrive-file-item";
import { useResourceFolderContent } from "./hooks";

export function GDriveFolderContent({ preaching }: { preaching?: boolean }) {
  const folderContentQuery = useResourceFolderContent(
    preaching ? "desc" : "asc",
  );

  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search")?.toLowerCase()?.trim() || "";

  if (folderContentQuery.isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-2 py-10 text-muted-foreground">
        <Loader2Icon className="size-5 animate-spin" />
        <p>Please wait</p>
        <p>Loading resources...</p>
      </div>
    );

  const folder = folderContentQuery.data?.folder;
  const files = folderContentQuery.data?.files;

  if (!folder) return <div>Cannot find resource.</div>;

  if (!files || files.length === 0) return <div>No resource found.</div>;

  const filesToDisplay = searchTerm
    ? files.filter((file) => file.name?.toLowerCase().includes(searchTerm))
    : files;

  return (
    <div className="space-y-4">
      <Link
        href={
          preaching ? "/gcc-resources/preachings" : "/gcc-resources/lessons"
        }
        className="text-sm hover:underline inline-block"
      >
        &larr; Back to {preaching ? "Preachings" : "Lessons"}
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderIcon className="size-4 text-amber-500 fill-current" />
            <h2 className="font-semibold">{folder?.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Found " : ""} {filesToDisplay.length}{" "}
            {pluralize("resource", filesToDisplay.length)}
          </p>
        </div>
        <SearchField />
      </div>
      {filesToDisplay.length === 0 && searchTerm ? (
        <div>No resource found for "{searchTerm}".</div>
      ) : (
        <>
          <Alert className="[&>svg]:text-amber-500">
            <LightbulbIcon />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              Click the file name to view the document in a new tab.
            </AlertDescription>
            <AlertDescription></AlertDescription>
          </Alert>
          <ul className="space-y-3">
            {filesToDisplay?.map((file) => (
              <li key={file.id}>
                <GDriveFileItem file={file} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
