import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const uploads = await StoredUpload.find().select("-data").sort({ createdAt: -1 }).lean();
    const media = uploads.map((u) => ({
      _id: String(u._id),
      folder: u.folder,
      filename: u.filename,
      mimeType: u.mimeType,
      size: u.size,
      url: `/api/uploads/${u.folder}/${u.filename}`,
      createdAt: u.createdAt,
    }));
    return NextResponse.json({ success: true, media });
  } catch (err) {
    return handleApiError(err);
  }
}
