import { connectToDatabase } from "@/lib/mongodb";
import PricingOption, { IPricingOption } from "@/models/PricingOption";

export async function getPricingOptions(): Promise<IPricingOption[]> {
  await connectToDatabase();
  const options = await PricingOption.find({ active: true }).sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(options));
}
