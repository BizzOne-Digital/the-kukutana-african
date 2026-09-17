import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().default(""),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).optional().default(5),
  photo: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin");
  const featured = searchParams.get("featured");

  const query: Record<string, unknown> = {};
  if (featured === "true") query.featured = true;

  let cursor = Testimonial.find(query).sort({ order: 1, createdAt: -1 });
  if (admin !== "true") {
    const limit = searchParams.get("limit");
    if (limit) cursor = cursor.limit(Number(limit));
  }

  const testimonials = await cursor.lean();
  return NextResponse.json({ success: true, testimonials });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = testimonialSchema.parse(body);
    await connectToDatabase();
    const testimonial = await Testimonial.create(parsed);
    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }
    return handleApiError(err);
  }
}
