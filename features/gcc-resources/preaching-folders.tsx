"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { GDriveFolderItem } from "./gdrive-folder-item";
import { usePreachingFolders } from "./hooks";

export function PreachingFolders() {
  const foldersQuery = usePreachingFolders();

  if (foldersQuery.isLoading)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
        <Loader2Icon className="size-5 animate-spin" />
        <p>Please wait</p>
        <p>Loading preaching resources...</p>
      </div>
    );

  return (
    <div>
      <ul className="space-y-3">
        {foldersQuery.data?.map((folder) => (
          <li key={folder.id}>
            <Link href={`/gcc-resources/preachings/${folder.id}`}>
              <GDriveFolderItem folder={folder} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
