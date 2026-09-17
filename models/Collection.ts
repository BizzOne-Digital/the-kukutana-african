import mongoose, { Schema, models, model } from "mongoose";

export interface ICollection {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "General", index: true },
    imageUrl: { type: String, default: "" },
    galleryImages: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (models.Collection as mongoose.Model<ICollection>) ||
  model<ICollection>("Collection", CollectionSchema);
