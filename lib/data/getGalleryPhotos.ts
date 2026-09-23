import { connectToDatabase } from "@/lib/mongodb";
import GalleryPhoto, { IGalleryPhoto } from "@/models/GalleryPhoto";

export async function getGalleryPhotos(limit?: number): Promise<IGalleryPhoto[]> {
  await connectToDatabase();
  let cursor = GalleryPhoto.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 });
  if (limit) cursor = cursor.limit(limit);
  const photos = await cursor.lean();
  return JSON.parse(JSON.stringify(photos));
}
