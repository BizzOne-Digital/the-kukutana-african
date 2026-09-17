import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { UnauthorizedError } from "./auth";

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function handleApiError(err: unknown) {
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  console.error(err);
  return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
}
