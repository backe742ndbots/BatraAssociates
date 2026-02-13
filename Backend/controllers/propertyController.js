// controllers/propertyController.js


const Property = require("../models/Property");


exports.getAllPropertiesAdmin = async (req, res) => {
  try {
    const {
      q,
      category,
      city,
      status,            // active / inactive
      approvalStatus,    // approved / pending
      availabilityStatus,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    /* =====================
       SEARCH
    ===================== */
    if (q) {
      filter.$or = [
        { propertyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { dealerName: { $regex: q, $options: "i" } },
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.priceLakhs = {};
      if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
      if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
    }

    /* =====================
       QUERY
    ===================== */
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};


exports.getAllPropertiesBroker = async (req, res) => {
  try {
    const {
      q,
      category,
      city,
      approvalStatus,     // approved / pending
      availabilityStatus,
      minPrice,
      maxPrice,
    } = req.query;

    /* =====================
       BASE FILTER (BROKER)
    ===================== */
    const filter = {
      // 🔐 broker restriction
    };

    /* =====================
       SEARCH
    ===================== */
    if (q) {
      filter.$or = [
        { propertyName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    /* =====================
       FILTERS
    ===================== */
    if (category) filter.category = category;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.priceLakhs = {};
      if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
      if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
    }

    /* =====================
       QUERY
    ===================== */
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (err) {
    console.error("GET BROKER PROPERTIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch broker properties",
    });
  }
};




//previous exports.addProperties = async (req, res) => {
//   try {
//     /* =========================
//        FILE HANDLING
//     ========================= */
//     // if (!req.files || !req.files.cover) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Cover image is required",
//     //   });
//     // }
//     const cover = req.files?.cover
//       ? req.files.cover[0].path
//       : "https://t4.ftcdn.net/jpg/00/89/55/15/360_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg";

//     // const cover = req.files?.cover[0]?.path || ; // Cloudinary URL

//     const gallery = req.files.gallery
//       ? req.files.gallery.map(f => f.path)
//       : [];

//     const documents = req.files.documents
//       ? req.files.documents.map(f => f.path)
//       : [];

//     const map = req.files.map ? req.files.map[0].path : null;
//     const floorPlan = req.files.floorPlan ? req.files.floorPlan[0].path : null;


//     /* =========================
//        AMENITIES (checkboxes)
//     ========================= */
//     const amenities = {
//       swimmingPool: !!req.body["amenities[swimmingPool]"],
//       garden: !!req.body["amenities[garden]"],
//       garage: !!req.body["amenities[garage]"],
//       lift: !!req.body["amenities[lift]"],
//       powerBackup: !!req.body["amenities[powerBackup]"],
//       security: !!req.body["amenities[security]"],
//     };

//     /* =========================
//        CREATE PROPERTY
//     ========================= */

//     const propertyName = `${req.body.category?.charAt(0).toUpperCase() + req.body.category?.slice(1)} ${req.body.propertyType?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`.trim();

//     const property = await Property.create({
//       /* BASIC */
//       propertyName: propertyName,
//       propertyTitle: req.body.propertyTitle,
//       category: req.body.category,
//       propertyType: req.body.propertyType,
//       description: req.body.description,

//       /* DATES */
//       propertyAddedDate: new Date(),
//       propertyCode: `PROP-${Date.now()}`,

//       /* CONFIG */
//       bhk: req.body.bhk,
//       layout: req.body.layout,
//       bedrooms: req.body.bedrooms,
//       bathrooms: req.body.bathrooms,
//       balconies: req.body.balconies,
//       floorNumber: req.body.floorNumber,
//       totalFloors: req.body.totalFloors,

//       /* PRICING */
//       areaSqFt: req.body.areaSqFt,
//       priceLakhs: req.body.priceLakhs,
//       netPrice: req.body.netPrice,
//       demand: req.body.demand,

//       /* FURNISHING */
//       facing: req.body.facing,
//       furnishing: req.body.furnishing,

//       /* LOCATION */
//       city: req.body.city,
//       sector: req.body.sector,
//       block: req.body.block,
//       pocket: req.body.pocket,
//       road: req.body.road,
//       locality: req.body.locality,
//       address: req.body.address,
//       pincode: req.body.pincode,
//       mapLocationText: req.body.mapLocationText,

//       /* STATUS */
//       status: "active",
//       availabilityStatus: req.body.availabilityStatus,
//       legalStatus: req.body.legalStatus,
//       approvalStatus: req.body.approvalStatus,

//       /* EXTRA */
//       propertySource: req.body.propertySource,
//       comments: req.body.comments,
//       parkingStatus: req.body.parkingStatus,

//       /* DEALER */
//       dealerType: req.body.dealerType,
//       dealerName: req.body.dealerName,
//       dealerMobile: req.body.dealerMobile,
//       dealerSource: req.body.dealerSource,
//       referredBy: req.body.referredBy,

//       /* AMENITIES */
//       amenities,

//       /* MEDIA */
//       cover,
//       gallery,
//       map,
//       floorPlan,
//       documents,

//       /* AUDIT */
//       createdBy: req.user._id,
//       approvedBy:
//         req.body.approvalStatus === "approved" ? req.user._id : null,
//       approvedAt:
//         req.body.approvalStatus === "approved" ? new Date() : null,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Property added successfully",
//       property,
//     });

//   } catch (err) {
//     console.error("ADD PROPERTY ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to add property",
//     });
//   }
// };



//now exports.addProperties = async (req, res) => {
//   try {
//     /* =========================
//        FILE HANDLING
//     ========================= */
//     const cover = req.files?.cover
//       ? req.files.cover[0].path
//       : "https://t4.ftcdn.net/jpg/00/89/55/15/360_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg";

//     const gallery = req.files?.gallery
//       ? req.files.gallery.map(f => f.path)
//       : [];

//     const documents = req.files?.documents
//       ? req.files.documents.map(f => f.path)
//       : [];

//     const map = req.files?.map ? req.files.map[0].path : null;
//     const floorPlan = req.files?.floorPlan ? req.files.floorPlan[0].path : null;

//     /* =========================
//        AMENITIES
//     ========================= */
//     const amenities = {
//       swimmingPool: !!req.body["amenities[swimmingPool]"],
//       garden: !!req.body["amenities[garden]"],
//       garage: !!req.body["amenities[garage]"],
//       lift: !!req.body["amenities[lift]"],
//       powerBackup: !!req.body["amenities[powerBackup]"],
//       security: !!req.body["amenities[security]"],
//     };

//     /* =========================
//        🔥 DYNAMIC FIELDS
//     ========================= */
//     let customFields = {};
//     if (req.body.customFields) {
//       try {
//         customFields = JSON.parse(req.body.customFields);
//       } catch (e) {
//         console.error("Invalid customFields JSON");
//       }
//     }

//     /* =========================
//        PROPERTY NAME
//     ========================= */
//     const propertyName = `${req.body.category
//       ?.charAt(0)
//       .toUpperCase()}${req.body.category?.slice(1)} ${req.body.propertyType
//         ?.replace(/_/g, " ")
//         .replace(/\b\w/g, c => c.toUpperCase())}`.trim();

//     /* =========================
//        CREATE PROPERTY
//     ========================= */
//     const property = await Property.create({
//       /* BASIC */
//       propertyName,
//       propertyTitle: req.body.propertyTitle,
//       category: req.body.category,
//       propertyType: req.body.propertyType,
//       description: req.body.description,

//       /* DATES */
//       propertyAddedDate: new Date(),
//       propertyCode: `PROP-${Date.now()}`,

//       /* CONFIG */
//       bhk: req.body.bhk,
//       layout: req.body.layout,
//       bedrooms: req.body.bedrooms,
//       bathrooms: req.body.bathrooms,
//       balconies: req.body.balconies,
//       floorNumber: req.body.floorNumber,
//       totalFloors: req.body.totalFloors,

//       /* PRICING */
//       areaSqFt: req.body.areaSqFt,
//       priceLakhs: req.body.priceLakhs,
//       netPrice: req.body.netPrice,
//       demand: req.body.demand,

//       /* FURNISHING */
//       facing: req.body.facing,
//       furnishing: req.body.furnishing,

//       /* LOCATION */
//       city: req.body.city,
//       sector: req.body.sector,
//       block: req.body.block,
//       pocket: req.body.pocket,
//       road: req.body.road,
//       locality: req.body.locality,
//       address: req.body.address,
//       pincode: req.body.pincode,
//       mapLocationText: req.body.mapLocationText,

//       /* STATUS */
//       status: "active",
//       availabilityStatus: req.body.availabilityStatus,
//       legalStatus: req.body.legalStatus,
//       approvalStatus: req.body.approvalStatus,

//       /* EXTRA */
//       propertySource: req.body.propertySource,
//       comments: req.body.comments,
//       parkingStatus: req.body.parkingStatus,

//       /* DEALER */
//       dealerType: req.body.dealerType,
//       dealerName: req.body.dealerName,
//       dealerMobile: req.body.dealerMobile,
//       dealerSource: req.body.dealerSource,
//       referredBy: req.body.referredBy,

//       /* 🔥 DYNAMIC FIELDS */
//       customFields,

//       /* AMENITIES */
//       amenities,

//       /* MEDIA */
//       cover,
//       gallery,
//       map,
//       floorPlan,
//       documents,

//       /* AUDIT */
//       createdBy: req.user._id,
//       approvedBy:
//         req.body.approvalStatus === "approved" ? req.user._id : null,
//       approvedAt:
//         req.body.approvalStatus === "approved" ? new Date() : null,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Property added successfully",
//       property,
//     });

//   } catch (err) {
//     console.error("ADD PROPERTY ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to add property",
//     });
//   }
// };



exports.addProperties = async (req, res) => {
  try {
    /* =========================
       FILE HANDLING
    ========================= */
    const cover = req.files?.cover
      ? req.files.cover[0].path
      : "https://t4.ftcdn.net/jpg/00/89/55/15/360_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg";

    const gallery = req.files?.gallery
      ? req.files.gallery.map(f => f.path)
      : [];

    const documents = req.files?.documents
      ? req.files.documents.map(f => f.path)
      : [];

    const map = req.files?.map ? req.files.map[0].path : null;
    const floorPlan = req.files?.floorPlan ? req.files.floorPlan[0].path : null;

    /* =========================
       CLEAN HELPERS
    ========================= */
    const toNumber = (val) =>
      val !== undefined && val !== null && val !== ""
        ? Number(val)
        : undefined;

    const clean = (val) =>
      val !== undefined && val !== null && val !== ""
        ? val
        : undefined;

    /* =========================
       GENERATE SERIAL PROPERTY CODE (00AA)
    ========================= */
    const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const getNextCode = async () => {
      // 1️⃣ Find highest existing propertyCode
      const last = await Property
        .findOne({ propertyCode: { $exists: true } })
        .sort({ propertyCode: -1 })   // ✅ FIXED (important)
        .lean();

      // 2️⃣ If no property exists
      if (!last?.propertyCode || last.propertyCode.length !== 4) {
        return "00AA";
      }

      const code = last.propertyCode;

      let num = parseInt(code.slice(0, 2));
      let i1 = ALPHABETS.indexOf(code[2]);
      let i2 = ALPHABETS.indexOf(code[3]);

      // Increment last alphabet
      i2++;

      if (i2 === 26) {
        i2 = 0;
        i1++;
      }

      if (i1 === 26) {
        i1 = 0;
        num++;
      }

      // Optional safety limit (99ZZ max)
      if (num > 99) {
        throw new Error("Property code limit reached (99ZZ)");
      }

      return `${String(num).padStart(2, "0")}${ALPHABETS[i1]}${ALPHABETS[i2]}`;
    };
    const propertyCode = await getNextCode();

    /* =========================
       AMENITIES
    ========================= */
    const amenities = {
      swimmingPool: !!req.body["amenities[swimmingPool]"],
      garden: !!req.body["amenities[garden]"],
      garage: !!req.body["amenities[garage]"],
      lift: !!req.body["amenities[lift]"],
      powerBackup: !!req.body["amenities[powerBackup]"],
      security: !!req.body["amenities[security]"],
    };

    /* =========================
       DYNAMIC FIELDS
    ========================= */
    let customFields = {};
    if (req.body.customFields) {
      try {
        customFields = JSON.parse(req.body.customFields);
      } catch (e) {
        console.error("Invalid customFields JSON");
      }
    }

    /* =========================
       BUILD PROPERTY NAME
    ========================= */
    const propertyNameParts = [];

    if (req.body.bhk) propertyNameParts.push(`${req.body.bhk} BHK`);

    if (req.body.propertyType) {
      propertyNameParts.push(
        req.body.propertyType
          .replace(/_/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase())
      );
    }

    if (req.body.sector)
      propertyNameParts.push(`Sector ${req.body.sector}`);

    if (req.body.city) propertyNameParts.push(req.body.city);

    const propertyName = propertyNameParts.join(", ");

    /* =========================
       CREATE PROPERTY
    ========================= */
    const property = await Property.create({
      /* BASIC */
      propertyName,
      propertyCode,
      propertyTitle: clean(req.body.propertyTitle),
      category: clean(req.body.category),
      propertyType: clean(req.body.propertyType),
      description: clean(req.body.description),

      /* DATES */
      propertyAddedDate: new Date(),

      /* CONFIG */
      bhk: toNumber(req.body.bhk),
      layout: clean(req.body.layout),
      bedrooms: toNumber(req.body.bedrooms),
      bathrooms: toNumber(req.body.bathrooms),
      balconies: toNumber(req.body.balconies),
      floorNumber: toNumber(req.body.floorNumber),
      totalFloors: toNumber(req.body.totalFloors),

      /* =====================
         PRICING (FLAT)
      ===================== */
      areaSqFt: toNumber(req.body.areaSqFt),
      priceLakhs: toNumber(req.body.priceLakhs),
      netPrice: clean(req.body.netPrice),
      demand: clean(req.body.demand),

      /* =====================
         PRICING (NESTED)
      ===================== */
      pricing: {
        askingRaw: clean(req.body.priceLakhs),
        netRaw: clean(req.body.netPrice),
        demand: clean(req.body.demand),
      },

      /* =====================
         LOCATION (FLAT)
      ===================== */
      city: clean(req.body.city),
      sector: clean(req.body.sector),
      block: clean(req.body.block),
      pocket: clean(req.body.pocket),
      road: clean(req.body.road),
      locality: clean(req.body.locality),
      address: clean(req.body.address),
      pincode: clean(req.body.pincode),
      mapLocationText: clean(req.body.mapLocationText),

      /* =====================
         LOCATION (NESTED)
      ===================== */
      location: {
        city: clean(req.body.city),
        sector: clean(req.body.sector),
        block: clean(req.body.block),
        pocket: clean(req.body.pocket),
        road: clean(req.body.road),
        locality: clean(req.body.locality),
        address: clean(req.body.address),
        pincode: clean(req.body.pincode),
      },

      /* STATUS */
      status: "active",
      availabilityStatus: clean(req.body.availabilityStatus),
      legalStatus: clean(req.body.legalStatus),
      approvalStatus: clean(req.body.approvalStatus),

      /* EXTRA */
      propertySource: clean(req.body.propertySource),
      comments: clean(req.body.comments),
      parkingStatus: clean(req.body.parkingStatus),

      /* =====================
         DEALER (FLAT)
      ===================== */
      dealerType: clean(req.body.dealerType),
      dealerName: clean(req.body.dealerName),
      dealerMobile: clean(req.body.dealerMobile),
      dealerSource: clean(req.body.dealerSource),
      referredBy: clean(req.body.referredBy),

      /* =====================
         DEALER (NESTED)
      ===================== */
      dealer: {
        type: clean(req.body.dealerType),
        name: clean(req.body.dealerName),
        mobile: clean(req.body.dealerMobile),
        source: clean(req.body.dealerSource),
        referredBy: clean(req.body.referredBy),
      },

      /* AMENITIES */
      amenities,

      /* MEDIA */
      cover,
      gallery,
      map,
      floorPlan,
      documents,

      /* CUSTOM */
      customFields,

      /* AUDIT */
      createdBy: req.user._id,
      approvedBy:
        req.body.approvalStatus === "approved" ? req.user._id : null,
      approvedAt:
        req.body.approvalStatus === "approved" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
      property,
    });

  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add property",
    });
  }
};


exports.PropertyDetails = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Property details for ${id}` });
};

exports.getPropertyEdit = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Edit property ${id}` });
};

exports.getPropertyEditUpdate = async (req, res) => {
  const { id } = req.params;
  res.json({ message: `Property ${id} updated` });
};
