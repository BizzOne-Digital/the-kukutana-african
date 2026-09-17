import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/apiHelpers";

const bookingSchema = z.object({
  fullName: z.string().min(1),
  organization: z.string().optional().default(""),
  email: z.string().email(),
  phone: z.string().min(7),
  groupType: z.enum([
    "School",
    "Church",
    "Corporate",
    "Fraternity / Sorority",
    "Tour Group",
    "Nonprofit / Civil Organization",
    "Family / Private Group",
    "Other",
  ]),
  numberOfGuests: z.number().min(1),
  preferredDate: z.string().min(1),
  alternateDate: z.string().optional(),
  preferredTime: z.string().optional().default(""),
  message: z.string().optional().default(""),
  specialRequirements: z.string().optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.parse(body);

    if (parsed.website) {
      // Honeypot triggered — silently accept without persisting.
      return NextResponse.json({ success: true });
    }

    if (parsed.numberOfGuests < 15) {
      return NextResponse.json(
        { success: false, error: "Group tours currently require 15 or more guests." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const booking = await Booking.create({
      ...parsed,
      preferredDate: new Date(parsed.preferredDate),
      alternateDate: parsed.alternateDate ? new Date(parsed.alternateDate) : undefined,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
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
    const status = searchParams.get("status");
    const groupType = searchParams.get("groupType");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (groupType && groupType !== "all") query.groupType = groupType;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    return handleApiError(err);
  }
}
