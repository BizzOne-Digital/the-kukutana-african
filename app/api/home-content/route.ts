import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import HomeContent from "@/models/HomeContent";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

export async function GET() {
  await connectToDatabase();
  let content = await HomeContent.findOne();
  if (!content) {
    content = await HomeContent.create({});
  }
  return NextResponse.json({ success: true, content });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await connectToDatabase();

    let content = await HomeContent.findOne();
    if (!content) {
      content = new HomeContent({});
    }
    content.set(body);
    await content.save();

    return NextResponse.json({ success: true, content });
  } catch (err) {
    return handleApiError(err);
  }
}
