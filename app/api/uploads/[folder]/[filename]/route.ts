import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StoredUpload, { UploadFolder } from "@/models/StoredUpload";
import { ALLOWED_FOLDERS } from "@/lib/uploads/constants";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  await connectToDatabase();
  const upload = await StoredUpload.findOne({ folder: folder as UploadFolder, filename }).lean();

  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(upload.data as unknown as Buffer), {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
