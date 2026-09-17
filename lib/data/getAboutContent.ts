import { connectToDatabase } from "@/lib/mongodb";
import AboutContent, { IAboutContent } from "@/models/AboutContent";

export async function getAboutContent(): Promise<IAboutContent> {
  await connectToDatabase();
  let content = await AboutContent.findOne().lean();
  if (!content) {
    content = (await AboutContent.create({})).toObject();
  }
  return JSON.parse(JSON.stringify(content));
}
