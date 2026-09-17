import mongoose, { Schema, models, model } from "mongoose";

export interface IContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default (models.ContactSubmission as mongoose.Model<IContactSubmission>) ||
  model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);
