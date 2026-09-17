import mongoose, { Schema, models, model } from "mongoose";

export interface ISiteSettings {
  museumName: string;
  shortMuseumName: string;
  logoUrl: string;
  faviconUrl: string;

  email: string;
  directPhone: string;
  businessPhone1: string;
  businessPhone2: string;
  businessPhone3: string;

  website: string;

  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  x: string;

  historyAudioUrl: string;
  enableHistoryAudio: boolean;

  primaryColor: string;
  secondaryColor: string;

  footerText: string;

  seoTitle: string;
  seoDescription: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    museumName: { type: String, default: "Kukutana African American History & Culture Museum" },
    shortMuseumName: { type: String, default: "Kukutana" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },

    email: { type: String, default: "KukutanaHistoryMuseum@gmail.com" },
    directPhone: { type: String, default: "(901) 502-2326" },
    businessPhone1: { type: String, default: "(901) 659-6551" },
    businessPhone2: { type: String, default: "(901) 659-5444" },
    businessPhone3: { type: String, default: "(901) 659-5873" },

    website: { type: String, default: "KukutanaHistoryMuseum.com" },

    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    x: { type: String, default: "" },

    historyAudioUrl: { type: String, default: "" },
    enableHistoryAudio: { type: Boolean, default: false },

    primaryColor: { type: String, default: "#C9A24A" },
    secondaryColor: { type: String, default: "#2D152F" },

    footerText: { type: String, default: "A Stronger Tomorrow Lives in Our History." },

    seoTitle: { type: String, default: "Kukutana African American History & Culture Museum" },
    seoDescription: {
      type: String,
      default:
        "Honoring the past, inspiring the present, and empowering the future through African American history and culture.",
    },
  },
  { timestamps: true }
);

export default (models.SiteSettings as mongoose.Model<ISiteSettings>) ||
  model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
