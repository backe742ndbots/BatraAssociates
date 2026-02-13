const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    verificationStatus: String,

    dealerType: String,

    company: String,

    contactPerson: String,

    whatsapp: String,

    mobile: String,

    block: String,

    pocket: String,

    propertyNumber: String,

    sector: String,

    city: String,

    email: String,

    landline: String,

    officeType: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Dealer", dealerSchema);
