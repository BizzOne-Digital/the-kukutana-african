import mongoose, { Schema, models, model } from "mongoose";

export interface ITimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface IAboutContent {
  heroEyebrow: string;
  heroTitle: string;
  heroImage: string;
  introduction: string;
  meaningOfKukutana: string;
  mission: string;
  vision: string;
  communityImpact: string;
  educationalMission: string;
  preservationMission: string;
  futureVision: string;
  futureHomeStory: string;
  legacy: string;
  timeline: ITimelineItem[];
  images: {
    intro: string;
    mission: string;
    community: string;
    future: string;
  };
}

const TimelineItemSchema = new Schema<ITimelineItem>(
  { year: String, title: String, description: String },
  { _id: false }
);

const AboutContentSchema = new Schema<IAboutContent>(
  {
    heroEyebrow: { type: String, default: "OUR STORY" },
    heroTitle: { type: String, default: "A Museum Built for the People" },
    heroImage: { type: String, default: "" },
    introduction: {
      type: String,
      default:
        "Kukutana African American History & Culture Museum was founded to give voice to stories too often left untold, gathering artifacts, documents, and testimonies that trace a journey of struggle, resilience, and triumph.",
    },
    meaningOfKukutana: {
      type: String,
      default:
        "“Kukutana” is a Swahili word meaning “to meet” or “to come together.” It reflects our belief that history is best understood in community — through shared learning, dialogue, and remembrance.",
    },
    mission: {
      type: String,
      default:
        "Our mission is to preserve, interpret, and share African American history and culture in ways that educate, inspire, and unite people of all backgrounds.",
    },
    vision: {
      type: String,
      default:
        "We envision a future where the full, unfiltered story of African American history is accessible, celebrated, and woven permanently into how communities understand their shared past.",
    },
    communityImpact: {
      type: String,
      default:
        "Through school partnerships, guided tours, and public programming, Kukutana has welcomed generations of visitors — students, families, elders, and travelers — into a space built for reflection and pride.",
    },
    educationalMission: {
      type: String,
      default:
        "Every exhibit is designed as a learning experience, pairing artifacts with context so visitors leave with a deeper understanding of the people and events that shaped history.",
    },
    preservationMission: {
      type: String,
      default:
        "We are committed to the careful preservation of historical artifacts, documents, and oral histories, ensuring they remain intact for future generations of researchers and visitors.",
    },
    futureVision: {
      type: String,
      default:
        "As Kukutana grows, we continue to expand our collections, exhibitions, and community reach — building toward a permanent home worthy of the stories we protect.",
    },
    futureHomeStory: {
      type: String,
      default:
        "Kukutana continues to explore opportunities for an expanded permanent home, one that can house our growing collection and welcome even more visitors into this shared history.",
    },
    legacy: {
      type: String,
      default:
        "Kukutana's legacy is measured not in artifacts alone, but in the lives changed by encountering them — a legacy carried forward by every visitor, student, and community partner.",
    },
    timeline: {
      type: [TimelineItemSchema],
      default: [
        { year: "Founding", title: "A Vision Takes Shape", description: "Kukutana begins as a community effort to preserve African American history and culture." },
        { year: "Growth", title: "Expanding the Collection", description: "Exhibits and artifacts grow through community donations and partnerships." },
        { year: "Today", title: "A Cultural Institution", description: "Kukutana welcomes visitors, students, and organizations from across the region." },
        { year: "Tomorrow", title: "A Permanent Home", description: "Plans continue for an expanded home to serve future generations." },
      ],
    },
    images: {
      intro: { type: String, default: "" },
      mission: { type: String, default: "" },
      community: { type: String, default: "" },
      future: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default (models.AboutContent as mongoose.Model<IAboutContent>) ||
  model<IAboutContent>("AboutContent", AboutContentSchema);
