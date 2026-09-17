import mongoose, { Schema, models, model } from "mongoose";

export interface IStat {
  label: string;
  value: string;
}

export interface IHomeContent {
  hero: {
    eyebrow: string;
    title: string;
    italicTitle: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    quote: string;
    heroMainImage: string;
    heroArtifactImage: string;
    heroPortraitImage1: string;
    heroPortraitImage2: string;
    heroAccentImage: string;
  };
  aboutPreview: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    quote: string;
  };
  experience: {
    heading: string;
    description: string;
    image: string;
    stats: IStat[];
  };
  pricingNotice: string;
  finalCta: {
    heading: string;
    subheading: string;
    image: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
}

const StatSchema = new Schema<IStat>(
  { label: String, value: String },
  { _id: false }
);

const HomeContentSchema = new Schema<IHomeContent>(
  {
    hero: {
      eyebrow: { type: String, default: "PEOPLE • PURPOSE • PRESERVATION" },
      title: { type: String, default: "A Historical Museum with a Heart for People!" },
      italicTitle: { type: String, default: "A Museum with a Soul..." },
      description: {
        type: String,
        default: "Honoring the past. Inspiring the present. Empowering the future.",
      },
      primaryCtaLabel: { type: String, default: "Plan Your Visit" },
      primaryCtaHref: { type: String, default: "/booking" },
      secondaryCtaLabel: { type: String, default: "Book a Group Tour" },
      secondaryCtaHref: { type: String, default: "/booking" },
      quote: {
        type: String,
        default: "“Those who do not know their history are doomed to repeat it.”",
      },
      heroMainImage: { type: String, default: "" },
      heroArtifactImage: { type: String, default: "" },
      heroPortraitImage1: { type: String, default: "" },
      heroPortraitImage2: { type: String, default: "" },
      heroAccentImage: { type: String, default: "" },
    },
    aboutPreview: {
      eyebrow: { type: String, default: "ABOUT KUKUTANA" },
      title: { type: String, default: "More Than a Museum. A Movement." },
      description: {
        type: String,
        default:
          "Kukutana African American History & Culture Museum exists to preserve, teach, and celebrate the stories that have shaped a people and a nation. Through immersive exhibits and community programming, we build bridges between generations.",
      },
      ctaLabel: { type: String, default: "Learn More About Us" },
      ctaHref: { type: String, default: "/about" },
      image: { type: String, default: "" },
      quote: { type: String, default: "“When we know our history, we know our worth.”" },
    },
    experience: {
      heading: { type: String, default: "Decades of Preserving History" },
      description: {
        type: String,
        default:
          "From humble beginnings to a growing cultural institution, Kukutana has spent decades collecting, preserving, and sharing the artifacts and stories of African American history.",
      },
      image: { type: String, default: "" },
      stats: {
        type: [StatSchema],
        default: [
          { label: "Years of Preservation", value: "40+" },
          { label: "Museum Exhibitions", value: "40+" },
          { label: "Cultural Reach", value: "Global" },
          { label: "Artifacts & Documents", value: "Historic" },
        ],
      },
    },
    pricingNotice: {
      type: String,
      default: "No child who cannot afford admission will be refused.",
    },
    finalCta: {
      heading: { type: String, default: "Support the Past. Empower the Future." },
      subheading: {
        type: String,
        default: "Visit. Book a tour. Make a donation. Be a part of the story.",
      },
      image: { type: String, default: "" },
      primaryCtaLabel: { type: String, default: "Plan Your Visit" },
      primaryCtaHref: { type: String, default: "/booking" },
      secondaryCtaLabel: { type: String, default: "Support the Museum" },
      secondaryCtaHref: { type: String, default: "/contact" },
    },
  },
  { timestamps: true }
);

export default (models.HomeContent as mongoose.Model<IHomeContent>) ||
  model<IHomeContent>("HomeContent", HomeContentSchema);
