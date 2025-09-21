"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { GDriveFolderItem } from "./gdrive-folder-item";
import { useResourcesFolders } from "./hooks";

export function ResourcesFolders() {
  const foldersQuery = useResourcesFolders();

  if (foldersQuery.isLoading)
    return (
      <div className="flex flex-col items-center h-[60vh] justify-center gap-2 py-10 text-muted-foreground">
        <Loader2Icon className="size-5 animate-spin" />
        <p>Please wait</p>
        <p>Loading lessons...</p>
      </div>
    );

  return (
    <div>
      <ul className="space-y-3">
        {foldersQuery.data?.map((folder) => (
          <li key={folder.id}>
            <Link href={`/gcc-resources/lessons/${folder.id}`}>
              <GDriveFolderItem folder={folder} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
