import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "confirmed", "completed", "cancelled"]),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    await connectToDatabase();
    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    await connectToDatabase();
    const booking = await Booking.findByIdAndUpdate(id, parsed, { new: true });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    await connectToDatabase();
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
