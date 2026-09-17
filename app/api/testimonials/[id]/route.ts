import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";
import { deleteStoredUploadByUrl } from "@/lib/uploads/deleteStoredUpload";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  quote: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  photo: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
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

    const existing = await Testimonial.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    const previousPhoto = existing.photo;
    Object.assign(existing, parsed);
    await existing.save();

    if (parsed.photo && parsed.photo !== previousPhoto) {
      await deleteStoredUploadByUrl(previousPhoto);
    }

    return NextResponse.json({ success: true, testimonial: existing });
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
    const existing = await Testimonial.findByIdAndDelete(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    await deleteStoredUploadByUrl(existing.photo);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
