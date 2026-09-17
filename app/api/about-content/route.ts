import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

export async function GET() {
  await connectToDatabase();
  let content = await AboutContent.findOne();
  if (!content) {
    content = await AboutContent.create({});
  }
  return NextResponse.json({ success: true, content });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await connectToDatabase();

    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent({});
    }
    content.set(body);
    await content.save();

    return NextResponse.json({ success: true, content });
  } catch (err) {
    return handleApiError(err);
  }
}
