import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import PricingOption from "@/models/PricingOption";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const pricingSchema = z.object({
  title: z.string().min(1),
  price: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  discount: z.string().optional().default(""),
  free: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin");
  const query = admin === "true" ? {} : { active: true };
  const options = await PricingOption.find(query).sort({ sortOrder: 1 }).lean();
  return NextResponse.json({ success: true, options });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = pricingSchema.parse(body);
    await connectToDatabase();
    const option = await PricingOption.create(parsed);
    return NextResponse.json({ success: true, option }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }
    return handleApiError(err);
  }
}
