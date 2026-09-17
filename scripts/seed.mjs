import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SEED_EMAIL = process.env.ADMIN_SEED_EMAIL;
const ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required to run the seed script.");
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, default: "admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const PricingOptionSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const TestimonialSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
const Collection = mongoose.model("Collection", CollectionSchema);
const PricingOption = mongoose.model("PricingOption", PricingOptionSchema);
const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

const COLLECTIONS_SEED = [
  { title: "Civil Rights Collection", category: "Civil Rights", featured: true },
  { title: "Hip Hop Collection", category: "Culture", featured: true },
  { title: "African Royalty", category: "African Heritage", featured: true },
  { title: "Black & Proud Wax Museum", category: "Culture", featured: true },
  { title: "Sammy Davis Jr. Collection", category: "Icons", featured: true },
  { title: "History of Voting Rights", category: "Civil Rights", featured: true },
  { title: "Egyptian Treasures", category: "African Heritage", featured: false },
  { title: "Tuskegee Airmen Museum", category: "Military History", featured: false },
  { title: "Buffalo Soldiers Museum", category: "Military History", featured: false },
  { title: "Dr. Martin Luther King Jr. Museum", category: "Civil Rights", featured: false },
  { title: "Jim Crow Museum", category: "Civil Rights", featured: false },
  { title: "Black Invention Museum", category: "Education", featured: false },
];

const PRICING_SEED = [
  { title: "Adults", price: "$22", sortOrder: 1 },
  { title: "Students", price: "$15", sortOrder: 2 },
  { title: "Senior Citizens 65+", price: "$10", sortOrder: 3 },
  { title: "Teachers", price: "FREE", free: true, sortOrder: 4 },
  { title: "Veterans", price: "FREE", free: true, sortOrder: 5 },
  { title: "Members", price: "FREE", free: true, sortOrder: 6 },
  { title: "Groups of 15+", price: "", discount: "10% Discount", sortOrder: 7 },
  { title: "Corporate Rate", price: "", discount: "10% Discount", sortOrder: 8 },
  { title: "Church Rate", price: "", discount: "10% Discount", sortOrder: 9 },
  { title: "Fraternities & Sororities", price: "", discount: "10% Discount", sortOrder: 10 },
  { title: "Tour Bus Package", price: "", discount: "20% Discount", sortOrder: 11 },
];

const TESTIMONIALS_SEED = [
  {
    name: "Demo Visitor (Seed Data)",
    role: "Community Member",
    quote:
      "This is placeholder demo testimonial data seeded for development. Replace with real visitor testimonials from the admin panel.",
    rating: 5,
    featured: true,
    order: 1,
  },
  {
    name: "Demo Educator (Seed Data)",
    role: "Teacher",
    quote:
      "Placeholder seed testimonial. Add authentic testimonials via /admin/testimonials before launch.",
    rating: 5,
    featured: true,
    order: 2,
  },
];

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding.");

  // SiteSettings, HomeContent, and AboutContent are intentionally NOT seeded
  // here: this script uses loose placeholder schemas with no field defaults,
  // so pre-creating them would freeze those documents without the real
  // default copy. The app's own data helpers (lib/data/get*.ts) lazily
  // create these singletons on first request using the real Mongoose
  // models, which do carry the full default content.

  const collectionCount = await Collection.countDocuments();
  if (collectionCount === 0) {
    for (const [index, item] of COLLECTIONS_SEED.entries()) {
      await Collection.create({
        ...item,
        slug: slugify(item.title),
        shortDescription: `Explore the ${item.title} at Kukutana.`,
        active: true,
        sortOrder: index,
      });
    }
    console.log(`Seeded ${COLLECTIONS_SEED.length} collections.`);
  }

  const pricingCount = await PricingOption.countDocuments();
  if (pricingCount === 0) {
    await PricingOption.insertMany(PRICING_SEED.map((p) => ({ ...p, active: true })));
    console.log(`Seeded ${PRICING_SEED.length} pricing options.`);
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(TESTIMONIALS_SEED);
    console.log(`Seeded ${TESTIMONIALS_SEED.length} demo testimonials.`);
  }

  if (ADMIN_SEED_EMAIL && ADMIN_SEED_PASSWORD) {
    const existingAdmin = await AdminUser.findOne({ email: ADMIN_SEED_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(ADMIN_SEED_PASSWORD, 12);
      await AdminUser.create({
        name: "Museum Administrator",
        email: ADMIN_SEED_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
        active: true,
      });
      console.log(`Created initial admin user: ${ADMIN_SEED_EMAIL}`);
    } else {
      console.log("Admin seed user already exists, skipping.");
    }
  } else {
    console.log("ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set; skipping admin user seed.");
  }

  await mongoose.disconnect();
  console.log("Seeding complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
