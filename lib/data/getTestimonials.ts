import { connectToDatabase } from "@/lib/mongodb";
import Testimonial, { ITestimonial } from "@/models/Testimonial";

export async function getTestimonials(limit?: number): Promise<ITestimonial[]> {
  await connectToDatabase();
  let cursor = Testimonial.find().sort({ order: 1, createdAt: -1 });
  if (limit) cursor = cursor.limit(limit);
  const testimonials = await cursor.lean();
  return JSON.parse(JSON.stringify(testimonials));
}

export async function getFeaturedTestimonials(limit = 3): Promise<ITestimonial[]> {
  await connectToDatabase();
  const testimonials = await Testimonial.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(testimonials));
}
