import mongoose, { Schema, models, model } from "mongoose";

export type VideoType = "youtube" | "facebook" | "vimeo" | "external";

export interface IVideo {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoType: VideoType;
  videoUrl: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    videoType: { type: String, enum: ["youtube", "facebook", "vimeo", "external"], required: true },
    videoUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.Video as mongoose.Model<IVideo>) || model<IVideo>("Video", VideoSchema);
