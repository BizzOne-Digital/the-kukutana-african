import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import ContactSubmission from "@/models/ContactSubmission";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";
import { isRateLimited } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(1),
  website: z.string().optional().default(""), // honeypot
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.parse(body);

    if (parsed.website) {
      return NextResponse.json({ success: true });
    }

    await connectToDatabase();
    const submission = await ContactSubmission.create(parsed);
    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Please check the form fields" }, { status: 400 });
    }
    return handleApiError(err);
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread");
    const query = unread === "true" ? { read: false } : {};
    const submissions = await ContactSubmission.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    return handleApiError(err);
  }
}
