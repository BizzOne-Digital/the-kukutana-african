import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import StoredUpload, { UploadFolder } from "@/models/StoredUpload";
import { ALLOWED_FOLDERS, ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/uploads/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File) || typeof folder !== "string") {
    return NextResponse.json({ success: false, error: "Missing file or folder" }, { status: 400 });
  }

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ success: false, error: "Invalid folder" }, { status: 400 });
  }

  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ success: false, error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ success: false, error: "File exceeds 8MB limit" }, { status: 413 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;

    await connectToDatabase();
    await StoredUpload.create({
      folder: folder as UploadFolder,
      filename: uniqueName,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    });

    return NextResponse.json({
      success: true,
      url: `/api/uploads/${folder}/${uniqueName}`,
      filename: uniqueName,
      size: buffer.length,
      folder,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to store upload" }, { status: 500 });
  }
}
