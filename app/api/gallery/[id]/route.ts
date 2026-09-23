import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import GalleryPhoto from "@/models/GalleryPhoto";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";
import { deleteStoredUploadByUrl } from "@/lib/uploads/deleteStoredUpload";

const updateSchema = z.object({
  imageUrl: z.string().min(1).optional(),
  caption: z.string().optional(),
  category: z.enum(["Museum Photos", "Visitor Photos", "Events"]).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

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

    const existing = await GalleryPhoto.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    const previousImage = existing.imageUrl;
    Object.assign(existing, parsed);
    await existing.save();

    if (parsed.imageUrl && parsed.imageUrl !== previousImage) {
      await deleteStoredUploadByUrl(previousImage);
    }

    return NextResponse.json({ success: true, photo: existing });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    await connectToDatabase();
    const existing = await GalleryPhoto.findByIdAndDelete(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    await deleteStoredUploadByUrl(existing.imageUrl);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
