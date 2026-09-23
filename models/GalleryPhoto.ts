import mongoose, { Schema, models, model } from "mongoose";

export interface IGalleryPhoto {
  _id: string;
  imageUrl: string;
  caption: string;
  category: "Museum Photos" | "Visitor Photos" | "Events";
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Museum Photos", "Visitor Photos", "Events"],
      default: "Museum Photos",
    },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.GalleryPhoto as mongoose.Model<IGalleryPhoto>) ||
  model<IGalleryPhoto>("GalleryPhoto", GalleryPhotoSchema);
