import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { createAdminSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  await connectToDatabase();
  const admin = await AdminUser.findOne({ email: email.toLowerCase(), active: true });

  if (!admin) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession({
    adminId: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  });

  return NextResponse.json({ success: true });
}
