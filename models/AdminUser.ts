import mongoose, { Schema, models, model } from "mongoose";

export interface IAdminUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.AdminUser as mongoose.Model<IAdminUser>) ||
  model<IAdminUser>("AdminUser", AdminUserSchema);
