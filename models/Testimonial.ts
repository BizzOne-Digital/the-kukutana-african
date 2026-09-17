import mongoose, { Schema, models, model } from "mongoose";

export interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  photo: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    photo: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.Testimonial as mongoose.Model<ITestimonial>) ||
  model<ITestimonial>("Testimonial", TestimonialSchema);
