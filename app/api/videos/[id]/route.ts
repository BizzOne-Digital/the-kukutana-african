import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Video from "@/models/Video";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";
import { deleteStoredUploadByUrl } from "@/lib/uploads/deleteStoredUpload";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  videoType: z.enum(["youtube", "facebook", "vimeo", "external"]).optional(),
  videoUrl: z.string().min(1).optional(),
  featured: z.boolean().optional(),
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

    const existing = await Video.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    const previousThumb = existing.thumbnailUrl;
    Object.assign(existing, parsed);
    await existing.save();

    if (parsed.thumbnailUrl && parsed.thumbnailUrl !== previousThumb) {
      await deleteStoredUploadByUrl(previousThumb);
    }

    return NextResponse.json({ success: true, video: existing });
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
    const existing = await Video.findByIdAndDelete(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    await deleteStoredUploadByUrl(existing.thumbnailUrl);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
