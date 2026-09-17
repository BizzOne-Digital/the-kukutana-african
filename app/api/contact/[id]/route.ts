import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";

const updateSchema = z.object({ read: z.boolean() });

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
    const submission = await ContactSubmission.findByIdAndUpdate(id, parsed, { new: true });
    if (!submission) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, submission });
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
    const submission = await ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
