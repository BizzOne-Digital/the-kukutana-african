import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import GalleryPhoto from "@/models/GalleryPhoto";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const gallerySchema = z.object({
  imageUrl: z.string().min(1),
  caption: z.string().optional().default(""),
  category: z.enum(["Museum Photos", "Visitor Photos", "Events"]).optional().default("Museum Photos"),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin");
  const category = searchParams.get("category");

  const query: Record<string, unknown> = {};
  if (admin !== "true") query.active = true;
  if (category && category !== "all") query.category = category;

  const photos = await GalleryPhoto.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, photos });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = gallerySchema.parse(body);
    await connectToDatabase();
    const photo = await GalleryPhoto.create(parsed);
    return NextResponse.json({ success: true, photo }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }
    return handleApiError(err);
  }
}
