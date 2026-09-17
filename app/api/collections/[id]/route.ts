import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";
import { deleteStoredUploadByUrl } from "@/lib/uploads/deleteStoredUpload";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }
  await connectToDatabase();
  const collection = await Collection.findById(id).lean();
  if (!collection) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, collection });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateSchema.parse(body);

    await connectToDatabase();
    const existing = await Collection.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const previousImageUrl = existing.imageUrl;
    Object.assign(existing, parsed);
    await existing.save();

    if (parsed.imageUrl && parsed.imageUrl !== previousImageUrl) {
      await deleteStoredUploadByUrl(previousImageUrl);
    }

    return NextResponse.json({ success: true, collection: existing });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data", details: err.issues }, { status: 400 });
    }
    return handleApiError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Collection.findByIdAndDelete(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    await deleteStoredUploadByUrl(existing.imageUrl);
    for (const img of existing.galleryImages) {
      await deleteStoredUploadByUrl(img);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
