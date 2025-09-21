"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { API_ENDPOINTS, apiClient } from "@/lib/api-client";
import type { GDriveFilesByFolder, GDriveFolder } from "./types";

// Fetch preaching folders from the API
async function getPreachingFolders() {
  try {
    const response = await apiClient.get<GDriveFolder[] | undefined>(
      API_ENDPOINTS.GET_PREACHING_FOLDERS,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching preaching folders:", error);
    return [];
  }
}

export function usePreachingFolders() {
  return useQuery({
    queryKey: ["preaching-folders"],
    queryFn: getPreachingFolders,
  });
}

// Fetch resources folders from the API
async function getResourcesFolders() {
  try {
    const response = await apiClient.get<GDriveFolder[] | undefined>(
      API_ENDPOINTS.GET_RESOURCES_FOLDERS,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching resources folders:", error);
    return [];
  }
}

export function useResourcesFolders() {
  return useQuery({
    queryKey: ["resources-folders"],
    queryFn: getResourcesFolders,
  });
}

// Fetch resource folder contents by folder ID from the API
async function getResourceFolderContentsById(
  folderId: string,
  order: "asc" | "desc" = "asc",
): Promise<GDriveFilesByFolder> {
  try {
    const response = await apiClient.get<GDriveFilesByFolder>(
      `${API_ENDPOINTS.GET_RESOURCES_FOLDERS}/${folderId}`,
      {
        params: { order },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching resource folder conteny by id:", error);
    return { folder: undefined, files: undefined };
  }
}

export function useResourceFolderContent(order: "asc" | "desc" = "asc") {
  const { folderId } = useParams<{ folderId: string }>();

  return useQuery({
    queryKey: ["resource-folder-contents", folderId, order],
    queryFn: () => getResourceFolderContentsById(folderId, order),
    enabled: !!folderId,
  });
}
