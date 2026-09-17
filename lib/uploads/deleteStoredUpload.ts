import { connectToDatabase } from "@/lib/mongodb";
import StoredUpload, { UploadFolder } from "@/models/StoredUpload";
import { ALLOWED_FOLDERS } from "./constants";

/**
 * Deletes a StoredUpload referenced by its public /api/uploads/:folder/:filename URL.
 * Safe to call with any string; no-ops on anything that isn't one of our own upload URLs.
 * Callers must save/point to the new image successfully BEFORE deleting the old one.
 */
export async function deleteStoredUploadByUrl(url?: string | null): Promise<void> {
  if (!url || !url.startsWith("/api/uploads/")) return;

  const parts = url.replace("/api/uploads/", "").split("/");
  if (parts.length !== 2) return;

  const [folder, filename] = parts;
  if (!ALLOWED_FOLDERS.has(folder)) return;
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) return;

  await connectToDatabase();
  await StoredUpload.deleteOne({ folder: folder as UploadFolder, filename });
}
