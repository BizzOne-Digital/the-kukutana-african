import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const collectionSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional().default(""),
  description: z.string().optional().default(""),
  category: z.string().optional().default("General"),
  imageUrl: z.string().optional().default(""),
  galleryImages: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin");

  const query: Record<string, unknown> = {};
  if (admin !== "true") {
    query.active = true;
  }

  const category = searchParams.get("category");
  if (category && category !== "all") {
    query.category = category;
  }

  const featured = searchParams.get("featured");
  if (featured === "true") {
    query.featured = true;
  }

  const search = searchParams.get("search");
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const collections = await Collection.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, collections });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = collectionSchema.parse(body);

    await connectToDatabase();
    const existing = await Collection.findOne({ slug: parsed.slug });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug already in use" }, { status: 400 });
    }

    const collection = await Collection.create(parsed);
    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data", details: err.issues }, { status: 400 });
    }
    return handleApiError(err);
  }
}
