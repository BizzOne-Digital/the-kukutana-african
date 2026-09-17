import { connectToDatabase } from "@/lib/mongodb";
import SiteSettings, { ISiteSettings } from "@/models/SiteSettings";

export async function getSiteSettings(): Promise<ISiteSettings> {
  await connectToDatabase();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = (await SiteSettings.create({})).toObject();
  }
  return JSON.parse(JSON.stringify(settings));
}
