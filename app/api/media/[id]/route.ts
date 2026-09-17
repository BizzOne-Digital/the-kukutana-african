import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    await connectToDatabase();
    const upload = await StoredUpload.findByIdAndDelete(id);
    if (!upload) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
