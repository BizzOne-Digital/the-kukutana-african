import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import PricingOption from "@/models/PricingOption";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, isValidObjectId } from "@/lib/apiHelpers";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  price: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  discount: z.string().optional(),
  free: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

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
    const option = await PricingOption.findByIdAndUpdate(id, parsed, { new: true });
    if (!option) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, option });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
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
    const option = await PricingOption.findByIdAndDelete(id);
    if (!option) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
