import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

const CollectionSchema = new mongoose.Schema({}, { strict: false });
const Collection = mongoose.model("Collection", CollectionSchema);

const MAP = {
  "Civil Rights Collection": "/service1.png",
  "Hip Hop Collection": "/service2.png",
  "African Royalty": "/service3.png",
  "Black & Proud Wax Museum": "/service4.png",
  "Sammy Davis Jr. Collection": "/service5.png",
  "History of Voting Rights": "/service6.png",
  "Egyptian Treasures": "/service7.png",
  "Tuskegee Airmen Museum": "/service8.png",
  "Buffalo Soldiers Museum": "/service9.png",
  "Dr. Martin Luther King Jr. Museum": "/service10.png",
  "Jim Crow Museum": "/service11.png",
  "Black Invention Museum": "/service12.png",
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  for (const [title, imageUrl] of Object.entries(MAP)) {
    const res = await Collection.updateOne({ title }, { $set: { imageUrl } });
    console.log(title, "->", imageUrl, `(matched: ${res.matchedCount}, modified: ${res.modifiedCount})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
