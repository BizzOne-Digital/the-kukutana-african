import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

export async function GET() {
  await connectToDatabase();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return NextResponse.json({ success: true, settings });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await connectToDatabase();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({});
    }
    Object.assign(settings, body);
    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return handleApiError(err);
  }
}
