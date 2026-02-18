const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Force using realestate_db
const realestateDB = mongoose.connection.useDb("realestate_db");

// Import schemas instead of models
const extentionSchema = require("../models/extention").schema;
const flatsSchema = require("../models/flats").schema;
const kothiSchema = require("../models/kothi").schema;
const floorsSchema = require("../models/floors").schema;
const dealerSchema = require("../models/dealers").schema;
const partiesSchema = require("../models/parties").schema;
const mcdSchema = require("../models/mcd").schema;
const rentAtsSchema = require("../models/rentAts").schema;

// Re-register models on realestate_db connection
const Extention = realestateDB.model("Extention", extentionSchema);
const Flat = realestateDB.model("Flat", flatsSchema);
const Kothi = realestateDB.model("Kothi", kothiSchema);
const Floor = realestateDB.model("Floor", floorsSchema);
const Dealer = realestateDB.model("Dealer", dealerSchema);
const Party = realestateDB.model("Party", partiesSchema);
const MCD = realestateDB.model("MCD", mcdSchema);
const RentAts = realestateDB.model("RentAts", rentAtsSchema);

const modelMap = {
  extentions: Extention,
  flats: Flat,
  kothi: Kothi,
  floor: Floor,
  dealers: Dealer,
  parties: Party,
  mcd: MCD,
  rentAts: RentAts
};

router.get("/", async (req, res) => {
  try {
    const { type, ...filters } = req.query;

    if (!type || !modelMap[type]) {
      return res.status(400).json({
        success: false,
        message: "Invalid type"
      });
    }

    const Model = modelMap[type];

    const cleanFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") {
        cleanFilters[key] = filters[key];
      }
    });

    console.log("Using DB: realestate_db");
    console.log("TYPE:", type);
    console.log("FILTERS:", cleanFilters);

    const data = await Model.find(cleanFilters).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error("Shared Listings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;
