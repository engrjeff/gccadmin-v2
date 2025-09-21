import type { drive_v3 } from "googleapis";

export type GDriveFolder = drive_v3.Schema$File;

export type GDriveFile = drive_v3.Schema$File;

export type GDriveFilesByFolder = {
  folder: GDriveFolder | undefined;
  files: GDriveFile[] | undefined;
};
