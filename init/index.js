const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().catch(err => console.log("MongoDB connection error:", err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/MajorProject_1');
  console.log("Connected to MongoDB");
}

const initDB = async () => {
  await Listing.deleteMany({});

  // add default owner to all listings
  const listingsWithOwner = initData.map((obj) => ({
    ...obj,
    owner: "68b6a802e859a59bfd6c18f8"
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Database initialized with sample data");
};

initDB();
