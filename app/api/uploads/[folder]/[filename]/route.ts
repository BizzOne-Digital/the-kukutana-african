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
  // Not using .lean() here: with lean(), the Buffer-typed `data` field comes
  // back as a raw BSON Binary wrapper rather than a Node Buffer, and
  // Buffer.from() on that wrapper silently produces a truncated buffer —
  // the response then declares the real Content-Length but sends fewer
  // bytes, and the connection gets aborted mid-transfer. Hydrating the
  // document lets Mongoose's Buffer cast do this correctly.
  const upload = await StoredUpload.findOne({ folder: folder as UploadFolder, filename });

  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = Uint8Array.from(upload.data);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
