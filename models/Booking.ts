import mongoose, { Schema, models, model } from "mongoose";

export type GroupType =
  | "School"
  | "Church"
  | "Corporate"
  | "Fraternity / Sorority"
  | "Tour Group"
  | "Nonprofit / Civil Organization"
  | "Family / Private Group"
  | "Other";

export type BookingStatus = "new" | "contacted" | "confirmed" | "completed" | "cancelled";

export interface IBooking {
  _id: string;
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  groupType: GroupType;
  numberOfGuests: number;
  preferredDate: Date;
  alternateDate?: Date;
  preferredTime: string;
  message: string;
  specialRequirements: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    fullName: { type: String, required: true },
    organization: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    groupType: {
      type: String,
      enum: [
        "School",
        "Church",
        "Corporate",
        "Fraternity / Sorority",
        "Tour Group",
        "Nonprofit / Civil Organization",
        "Family / Private Group",
        "Other",
      ],
      required: true,
    },
    numberOfGuests: { type: Number, required: true, min: 1 },
    preferredDate: { type: Date, required: true },
    alternateDate: { type: Date },
    preferredTime: { type: String, default: "" },
    message: { type: String, default: "" },
    specialRequirements: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "completed", "cancelled"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export default (models.Booking as mongoose.Model<IBooking>) ||
  model<IBooking>("Booking", BookingSchema);
