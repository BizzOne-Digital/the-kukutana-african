import mongoose, { Schema, models, model } from "mongoose";

export interface IPricingOption {
  _id: string;
  title: string;
  price: string;
  subtitle: string;
  description: string;
  discount: string;
  free: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PricingOptionSchema = new Schema<IPricingOption>(
  {
    title: { type: String, required: true },
    price: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    discount: { type: String, default: "" },
    free: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.PricingOption as mongoose.Model<IPricingOption>) ||
  model<IPricingOption>("PricingOption", PricingOptionSchema);
