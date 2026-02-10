const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Property = require("../Backend/models/Property");

mongoose.set('bufferCommands', false);

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate_db';

// MongoDB connection options
const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};



// mongoose.connect(mongoURI, options)
//   .then(() => {
//     console.log('✅ MongoDB connected successfully');
//     console.log(`📊 Database: ${mongoose.connection.name}`);
//     console.log(`🎯 Host: ${mongoose.connection.host}`);
//     console.log(`🔗 Port: ${mongoose.connection.port}`);
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//     console.log('🔄 Attempting to reconnect in 5 seconds...');
//     setTimeout(() => this._connect(), 5000);
//   });

// =====================
// HELPERS
// =====================
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function nextPropertyCode(lastCode) {
  if (!lastCode || lastCode.length !== 4) return "00AA";

  let num = parseInt(lastCode.slice(0, 2));
  let i1 = ALPHABETS.indexOf(lastCode[2]);
  let i2 = ALPHABETS.indexOf(lastCode[3]);

  i2++;
  if (i2 === 26) {
    i2 = 0;
    i1++;
  }
  if (i1 === 26) {
    i1 = 0;
    num++;
  }

  return `${String(num).padStart(2, "0")}${ALPHABETS[i1]}${ALPHABETS[i2]}`;
}

const clean = (v) =>
  v === undefined || v === null || String(v).trim() === ""
    ? undefined
    : String(v).trim();

function buildPropertyName(bhk, sector, city) {
  const parts = [];
  if (bhk) parts.push(`${bhk} BHK`);
  parts.push("Builder Floor");

  const loc = [];
  if (sector) loc.push(`Sector ${sector}`);
  if (city) loc.push(city);

  if (loc.length) parts.push(loc.join(" "));
  return parts.join(", ");
}

// =====================
// MAIN
// =====================







async function run() {

  await mongoose.connect(mongoURI, options);

  await mongoose.connection.asPromise();

  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🎯 Host: ${mongoose.connection.host}`);
  console.log(`🔗 Port: ${mongoose.connection.port}`);
  const lastDoc = await Property
    .findOne({ propertyCode: { $exists: true } })
    .sort({ createdAt: -1 })
    .lean();

  let currentCode = lastDoc?.propertyCode || null;
  const records = [];

  fs.createReadStream("kothi.csv") // 🔁 your kothi CSV file
    .pipe(csv())
    .on("data", (row) => {
      currentCode = nextPropertyCode(currentCode);

      records.push({
        propertyCode: currentCode,

        // 🔒 FIXED
        propertyType: "kothi",
        category: "residential",

        // 🏷️ BASIC
        propertyName: buildKothiName(row),
        propertyTitle:
          row.TITLE === "FH"
            ? "FREEHOLD"
            : row.TITLE === "LH"
              ? "LEASEHOLD"
              : undefined,

        // 📅 DATE
        propertyAddedDate: row.DATE ? new Date(row.DATE) : undefined,

        // 🏠 CONFIG
        bhk: row.BHK,
        totalFloors: row.FLR,
        areaSqFt: Number(row.AREA) || undefined,

        // 💰 PRICE
        priceLakhs: Number(row.ASKING) || undefined,
        netPrice: Number(row["NET PRICE"]) || undefined,

        // 📍 LOCATION
        city: row.CITY,
        sector: row.SEC || row["SEC.1"],
        block: row.BLK,
        pocket: row.PKT,
        road: row.ROAD,

        // 🧭 FACING
        facing: row.FACE?.toLowerCase(),

        // 📌 STATUS
        availabilityStatus: row.STATUS?.toLowerCase(),
        comments: row["STATUS.1"] || row["STATUS.2"],

        // 🤝 DEALER
        dealerType: row.THROUGH?.toLowerCase(),
        dealerSource: row["OFFICE NAME"],
        dealerName: row.NAME,
        dealerMobile: row.MOBILE,

        // 🧩 EXTRA (SAFE STORAGE)
        customFields: {
          propertyNumber: row.NUM,
          altMobile: row["MOBILE.1"],
          blockPocket: row["BLK PKT"],
        },
      });
    })
    .on("end", async () => {
      try {
        await Property.insertMany(records);
        console.log(`✅ Imported ${records.length} kothi properties`);
      } catch (err) {
        console.error("❌ Import failed:", err);
      } finally {
        await mongoose.disconnect();
        process.exit(0);
      }
    });
}

run().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});