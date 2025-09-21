import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/drive"],
  credentials: {
    client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  },
});

const gdrive = google.drive({
  version: "v3",
  auth,
});

export async function getPreachingFolders() {
  try {
    const rootFolder = await gdrive.files.list({
      q: `name='Preaching'`,
      spaces: "drive",
    });

    if (!rootFolder.data.files) {
      return [];
    }

    const root = rootFolder.data.files[0];

    const preachingFolders = await gdrive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and '${root.id}' in parents`,
      fields: "nextPageToken, files(id, name, description, iconLink)",
      orderBy: "name desc",
      spaces: "drive",
    });

    return preachingFolders.data.files;
  } catch (error) {
    console.log("GCC Resources: Error fetching preaching folders:", error);
    return [];
  }
}

export async function getResourcesFolders() {
  try {
    const rootFolder = await gdrive.files.list({
      q: `name='gcc_app'`,
      spaces: "drive",
    });

    if (!rootFolder.data.files) {
      return [];
    }

    const root = rootFolder.data.files[0];

    const resourcesFolders = await gdrive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and '${root.id}' in parents`,
      fields: "nextPageToken, files(id, name, description)",
      orderBy: "createdTime asc",
      spaces: "drive",
    });

    return resourcesFolders.data.files;
  } catch (error) {
    console.log("GCC Resources: Error fetching resources folders:", error);
    return [];
  }
}

export async function getResourceFilesByFolder(
  folderId: string,
  order: "asc" | "desc" = "asc",
) {
  try {
    // get folder details first
    const folder = await gdrive.files.get({
      fileId: folderId,
      fields: "id,name,description",
    });

    const files = await gdrive.files.list({
      q: `mimeType = 'application/pdf' and '${folder.data.id}' in parents`,
      fields:
        "nextPageToken, files(id,name,mimeType,kind,description,thumbnailLink,fileExtension,size,webViewLink,webContentLink,createdTime)",
      orderBy: `name ${order}`,
      spaces: "drive",
    });

    return {
      folder: folder.data,
      files: files.data.files,
    };
  } catch (error) {
    console.log(
      "GCC Resources: Error fetching resource files by folder:",
      error,
    );
    return {
      folder: null,
      files: null,
    };
  }
}
