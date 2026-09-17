import { connectToDatabase } from "@/lib/mongodb";
import HomeContent, { IHomeContent } from "@/models/HomeContent";

export async function getHomeContent(): Promise<IHomeContent> {
  await connectToDatabase();
  let content = await HomeContent.findOne().lean();
  if (!content) {
    content = (await HomeContent.create({})).toObject();
  }
  return JSON.parse(JSON.stringify(content));
}
