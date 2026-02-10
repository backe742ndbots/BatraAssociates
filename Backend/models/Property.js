// // import mongoose from "mongoose";
// const mongoose = require("mongoose");


// const propertySchema = new mongoose.Schema(
//   {
//     /* =====================
//        BASIC INFO
//     ===================== */
//     propertyName: String, // ➕ from PDF
//     propertyTitle: {
//       type: String,
//       enum: ["FREEHOLD", "LEASEHOLD"],
//     },

//     category: {
//       type: String,
//       enum: ["residential", "commercial", "land", "industrial", "rent"],
//     },

//     propertyType: {
//       type: String,
//       enum: [
//         "builder_floor",
//         "flat",
//         "kothi",
//         "shop",
//         "office",
//         "showroom",
//         "plot",
//         "warehouse",

//       ],
//     },

//     description: String,

//     /* =====================
//        DATES (BUSINESS)
//     ===================== */
//     propertyAddedDate: Date,   // ➕ PDF
//     propertyUpdatedDate: Date, // ➕ PDF

//     /* =====================
//        CONFIGURATION
//     ===================== */
//     bhk: { type: Number, enum: [1, 2, 3, 4] },
//     layout: {
//       type: String,
//       enum: ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"],
//     },

//     bedrooms: Number,
//     bathrooms: Number,
//     balconies: Number,
//     floorNumber: Number,
//     totalFloors: Number,

//     /* =====================
//        PRICING
//     ===================== */
//     areaSqFt: Number,
//     priceLakhs: Number,
//     netPrice: Number,
//     demand: String,

//     /* =====================
//        FURNISHING
//     ===================== */
//     facing: {
//       type: String,
//       enum: ["north", "south", "east", "west"],
//     },

//     furnishing: {
//       type: String,
//       enum: ["furnished", "semi-furnished", "unfurnished"],
//     },

//     /* =====================
//        LOCATION
//     ===================== */
//     city: String,
//     sector: String,
//     block: String,
//     pocket: String,
//     road: String,
//     locality: String,
//     address: String,
//     pincode: String,

//     mapLocationText: String, // ➕ PDF text-based map info

//     /* =====================
//        STATUS (ALL TYPES)
//     ===================== */
//     status: {
//       type: String,
//       enum: ["active", "inactive"], // ➕ PDF
//       default: "active",
//     },

//     availabilityStatus: {
//       type: String,
//       enum: ["available", "hold", "sold", "rented"],
//       default: "available",
//     },

//     legalStatus: {
//       type: String,
//       enum: ["map_pass", "old_map", "with_roof", "mcd", "janta_faced"],
//     },

//     approvalStatus: {
//       type: String,
//       enum: ["approved", "pending"],
//       default: "pending",
//     },

//     /* =====================
//        EXTRA INFO
//     ===================== */
//     propertySource: String,
//     comments: String,
//     parkingStatus: String, // ➕ derived from PDF examples

//     /* =====================
//        DEALER / OWNER
//     ===================== */
//     dealerType: {
//       type: String,
//       enum: ["dealer", "owner", "party", "builder", "person"], // ➕ merged
//       default: "dealer",
//     },

//     dealerName: String,
//     dealerMobile: String,
//     dealerSource: String,
//     referredBy: String,
//     /* =====================
//        AMENITIES
//     ===================== */
//     amenities: {
//       swimmingPool: { type: Boolean, default: false },
//       garden: { type: Boolean, default: false },
//       garage: { type: Boolean, default: false },
//       lift: { type: Boolean, default: false },
//       powerBackup: { type: Boolean, default: false },
//       security: { type: Boolean, default: false },
//     },

//     /* =====================
//        MEDIA
//     ===================== */
//     cover: { type: String },
//     gallery: [String],
//     map: String,
//     floorPlan: String,
//     documents: [String],


//     customFields: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     /* =====================
//        AUDIT
//     ===================== */
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     approvedAt: Date,
//   },
//   { timestamps: true, strict: false }
// );

// module.exports = mongoose.model("Property", propertySchema);





















const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    /* =====================
       BASIC INFO
    ===================== */
    propertyName: String,

    propertyCode: {
      type: String,
      unique: true,
      index: true,
    },


    propertyTitle: {
      type: String,
      enum: ["FREEHOLD", "LEASEHOLD", "POH"],
    },

    category: {
      type: String,
      enum: ["residential", "commercial", "land", "industrial", "rent"],
    },

    propertyType: {
      type: String,
      enum: [
        "builder_floor",
        "flat",
        "kothi",
        "shop",
        "office",
        "showroom",
        "plot",
        "warehouse",
      ],
    },

    description: String,

    /* =====================
       DATES
    ===================== */
    propertyAddedDate: Date,
    propertyUpdatedDate: Date,

    /* =====================
       CONFIGURATION
    ===================== */
    bhk: String, // ✅ FIXED (was Number)

    layout: String, // flexible (CSV has many formats)

    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,

    floorNumber: Number,      // numeric floor (if available)
    floorInfo: String,        // ✅ NEW (FF, SF, GF+BASEMENT)

    totalFloors: Number,

    /* =====================
       PRICING
    ===================== */
    areaSqFt: Number,
    priceLakhs: Number,

    netPrice: String, // ✅ FIXED (was Number)
    demand: String,

    /* =====================
       FURNISHING
    ===================== */
    facing: {
      type: String,
      enum: [
        "north", "south", "east", "west",
        "ne", "nw", "se", "sw",
        "en", "es", "wn", "ws"
      ],
    },

    furnishing: String,

    /* =====================
       LOCATION
    ===================== */
    city: String,
    sector: String,
    block: String,
    pocket: String,
    road: String,
    locality: String,
    address: String,
    pincode: String,

    mapLocationText: String,

    /* =====================
       STATUS
    ===================== */
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "hold", "sold", "rented"],
      default: "available",
    },

    availabilityRemark: String, // ✅ NEW (CALL NOT PICKED etc)

    legalStatus: {
      type: String,
      enum: [
        "map_pass",
        "old_map",
        "with_roof",
        "mcd",
        "janta_face",
        "new_map",
        "no_map",
      ],
    },

    approvalStatus: {
      type: String,
      enum: ["approved", "pending"],
      default: "pending",
    },

    /* =====================
       EXTRA INFO
    ===================== */
    propertySource: String,
    comments: String,
    parkingStatus: String,


    /* =====================
   KOTHI / INDEPENDENT / PLOT SUPPORT
===================== */

    flatSize: String, // SIZE for flats (sq ft / sq m / builder size)


    // total floors / structure description
    stories: String,   // replaces numeric-only idea

    // plot & construction size clarity
    plotArea: String,       // from SIZE
    builtUpArea: String,   // numeric AREA when applicable
    areaRemark: String,    // AREA values like FF, PHASE 1

    // ownership / construction
    propertyCondition: {
      type: String,
      enum: ["new", "old", "renovated"],
    },

    constructionType: String, // GEN / COR / C0R / POH

    // pricing
    askingPrice: String,   // ASKING (ranges, decimals)

    // extra remarks
    statusRemark2: String, // STATUS.2

    // multiple contacts
    dealerMobiles: [String],





    /* =====================
       DEALER / OWNER
    ===================== */
    dealerType: {
      type: String,
      enum: ["dealer", "owner", "party", "builder", "person", "fin"],
      default: "dealer",
    },

    dealerName: String,
    dealerMobile: String,
    dealerSource: String,
    referredBy: String,

    /* =====================
       AMENITIES
    ===================== */
    amenities: {
      swimmingPool: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      garage: { type: Boolean, default: false },
      lift: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
    },

    /* =====================
       MEDIA
    ===================== */
    cover: String,
    gallery: [String],
    map: String,
    floorPlan: String,
    documents: [String],

    /* =====================
       CUSTOM / MIGRATION
    ===================== */
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /* =====================
       AUDIT
    ===================== */
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
  },
  {
    timestamps: true,
    strict: false, // ✅ good for CSV imports
  }
);

module.exports = mongoose.model("Property", propertySchema);
