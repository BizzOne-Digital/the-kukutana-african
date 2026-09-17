import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const videoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  thumbnailUrl: z.string().optional().default(""),
  videoType: z.enum(["youtube", "facebook", "vimeo", "external"]),
  videoUrl: z.string().min(1),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const query = featured === "true" ? { featured: true } : {};
  const videos = await Video.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, videos });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = videoSchema.parse(body);
    await connectToDatabase();
    const video = await Video.create(parsed);
    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }
    return handleApiError(err);
  }
}
