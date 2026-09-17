import { connectToDatabase } from "@/lib/mongodb";
import Collection, { ICollection } from "@/models/Collection";

export async function getFeaturedCollections(limit = 6): Promise<ICollection[]> {
  await connectToDatabase();
  const collections = await Collection.find({ active: true, featured: true })
    .sort({ sortOrder: 1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(collections));
}

export async function getAllCollections(): Promise<ICollection[]> {
  await connectToDatabase();
  const collections = await Collection.find({ active: true }).sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(collections));
}

export async function getCollectionBySlug(slug: string): Promise<ICollection | null> {
  await connectToDatabase();
  const collection = await Collection.findOne({ slug, active: true }).lean();
  return collection ? JSON.parse(JSON.stringify(collection)) : null;
}
