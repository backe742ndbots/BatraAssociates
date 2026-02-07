// // controllers/propertyController.js

// const Property = require("../models/Property");

// exports.getAllPropertiesAdmin = async (req, res) => {
//   try {
//     const {
//       q,
//       category,
//       city,
//       status,            // active / inactive
//       approvalStatus,    // approved / pending
//       availabilityStatus,
//       minPrice,
//       maxPrice,
//     } = req.query;

//     const filter = {};

//     /* =====================
//        SEARCH
//     ===================== */
//     if (q) {
//       filter.$or = [
//         { propertyName: { $regex: q, $options: "i" } },
//         { description: { $regex: q, $options: "i" } },
//         { dealerName: { $regex: q, $options: "i" } },
//       ];
//     }

//     /* =====================
//        FILTERS
//     ===================== */
//     if (category) filter.category = category;
//     if (status) filter.status = status;
//     if (approvalStatus) filter.approvalStatus = approvalStatus;
//     if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

//     if (city) {
//       filter.city = { $regex: city, $options: "i" };
//     }

//     if (minPrice || maxPrice) {
//       filter.priceLakhs = {};
//       if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
//       if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
//     }

//     /* =====================
//        QUERY
//     ===================== */
//     const properties = await Property.find(filter)
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: properties.length,
//       properties,
//     });

//   } catch (err) {
//     console.error("GET PROPERTIES ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch properties",
//     });
//   }
// };

// exports.getAllPropertiesBroker = async (req, res) => {
//   try {
//     const {
//       q,
//       category,
//       city,
//       approvalStatus,     // approved / pending
//       availabilityStatus,
//       minPrice,
//       maxPrice,
//     } = req.query;

//     /* =====================
//        BASE FILTER (BROKER)
//     ===================== */
//     const filter = {
//       // 🔐 broker restriction
//     };

//     /* =====================
//        SEARCH
//     ===================== */
//     if (q) {
//       filter.$or = [
//         { propertyName: { $regex: q, $options: "i" } },
//         { description: { $regex: q, $options: "i" } },
//       ];
//     }

//     /* =====================
//        FILTERS
//     ===================== */
//     if (category) filter.category = category;
//     if (approvalStatus) filter.approvalStatus = approvalStatus;
//     if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

//     if (city) {
//       filter.city = { $regex: city, $options: "i" };
//     }

//     if (minPrice || maxPrice) {
//       filter.priceLakhs = {};
//       if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
//       if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
//     }

//     /* =====================
//        QUERY
//     ===================== */
//     const properties = await Property.find(filter)
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: properties.length,
//       properties,
//     });

//   } catch (err) {
//     console.error("GET BROKER PROPERTIES ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch broker properties",
//     });
//   }
// };

// // exports.addProperties = async (req, res) => {
// //   try {
// //     /* =========================
// //        FILE HANDLING
// //     ========================= */
// //     // if (!req.files || !req.files.cover) {
// //     //   return res.status(400).json({
// //     //     success: false,
// //     //     message: "Cover image is required",
// //     //   });
// //     // }
// //     const cover = req.files?.cover
// //       ? req.files.cover[0].path
// //       : "https://t4.ftcdn.net/jpg/00/89/55/15/360_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg";

// //     // const cover = req.files?.cover[0]?.path || ; // Cloudinary URL

// //     const gallery = req.files.gallery
// //       ? req.files.gallery.map(f => f.path)
// //       : [];

// //     const documents = req.files.documents
// //       ? req.files.documents.map(f => f.path)
// //       : [];

// //     const map = req.files.map ? req.files.map[0].path : null;
// //     const floorPlan = req.files.floorPlan ? req.files.floorPlan[0].path : null;

// //     /* =========================
// //        AMENITIES (checkboxes)
// //     ========================= */
// //     const amenities = {
// //       swimmingPool: !!req.body["amenities[swimmingPool]"],
// //       garden: !!req.body["amenities[garden]"],
// //       garage: !!req.body["amenities[garage]"],
// //       lift: !!req.body["amenities[lift]"],
// //       powerBackup: !!req.body["amenities[powerBackup]"],
// //       security: !!req.body["amenities[security]"],
// //     };

// //     /* =========================
// //        CREATE PROPERTY
// //     ========================= */

// //     const propertyName = `${req.body.category?.charAt(0).toUpperCase() + req.body.category?.slice(1)} ${req.body.propertyType?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`.trim();

// //     const property = await Property.create({
// //       /* BASIC */
// //       propertyName: propertyName,
// //       propertyTitle: req.body.propertyTitle,
// //       category: req.body.category,
// //       propertyType: req.body.propertyType,
// //       description: req.body.description,

// //       /* DATES */
// //       propertyAddedDate: new Date(),
// //       propertyCode: `PROP-${Date.now()}`,

// //       /* CONFIG */
// //       bhk: req.body.bhk,
// //       layout: req.body.layout,
// //       bedrooms: req.body.bedrooms,
// //       bathrooms: req.body.bathrooms,
// //       balconies: req.body.balconies,
// //       floorNumber: req.body.floorNumber,
// //       totalFloors: req.body.totalFloors,

// //       /* PRICING */
// //       areaSqFt: req.body.areaSqFt,
// //       priceLakhs: req.body.priceLakhs,
// //       netPrice: req.body.netPrice,
// //       demand: req.body.demand,

// //       /* FURNISHING */
// //       facing: req.body.facing,
// //       furnishing: req.body.furnishing,

// //       /* LOCATION */
// //       city: req.body.city,
// //       sector: req.body.sector,
// //       block: req.body.block,
// //       pocket: req.body.pocket,
// //       road: req.body.road,
// //       locality: req.body.locality,
// //       address: req.body.address,
// //       pincode: req.body.pincode,
// //       mapLocationText: req.body.mapLocationText,

// //       /* STATUS */
// //       status: "active",
// //       availabilityStatus: req.body.availabilityStatus,
// //       legalStatus: req.body.legalStatus,
// //       approvalStatus: req.body.approvalStatus,

// //       /* EXTRA */
// //       propertySource: req.body.propertySource,
// //       comments: req.body.comments,
// //       parkingStatus: req.body.parkingStatus,

// //       /* DEALER */
// //       dealerType: req.body.dealerType,
// //       dealerName: req.body.dealerName,
// //       dealerMobile: req.body.dealerMobile,
// //       dealerSource: req.body.dealerSource,
// //       referredBy: req.body.referredBy,

// //       /* AMENITIES */
// //       amenities,

// //       /* MEDIA */
// //       cover,
// //       gallery,
// //       map,
// //       floorPlan,
// //       documents,

// //       /* AUDIT */
// //       createdBy: req.user._id,
// //       approvedBy:
// //         req.body.approvalStatus === "approved" ? req.user._id : null,
// //       approvedAt:
// //         req.body.approvalStatus === "approved" ? new Date() : null,
// //     });

// //     return res.status(201).json({
// //       success: true,
// //       message: "Property added successfully",
// //       property,
// //     });

// //   } catch (err) {
// //     console.error("ADD PROPERTY ERROR:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to add property",
// //     });
// //   }
// // };

// exports.addProperties = async (req, res) => {
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

// exports.PropertyDetails = async (req, res) => {
//   const { id } = req.params;
//   res.json({ message: `Property details for ${id}` });
// };

// exports.getPropertyEdit = async (req, res) => {
//   const { id } = req.params;
//   res.json({ message: `Edit property ${id}` });
// };

// exports.getPropertyEditUpdate = async (req, res) => {
//   const { id } = req.params;
//   res.json({ message: `Property ${id} updated` });
// };

// New Version
// controllers/propertyController.js
const Property = require("../models/Property");

exports.getAllPropertiesAdmin = async (req, res) => {
	try {
		const {
			q,
			category,
			city,
			status,
			approvalStatus,
			availabilityStatus,
			minPrice,
			maxPrice,
		} = req.query;

		const filter = {};

		/* SEARCH */
		if (q) {
			filter.$or = [
				{ propertyName: { $regex: q, $options: "i" } },
				{ description: { $regex: q, $options: "i" } },
				{ dealerName: { $regex: q, $options: "i" } },
			];
		}

		/* FILTERS */
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

		/* QUERY */
		const properties = await Property.find(filter).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: properties.length,
			properties,
		});
	} catch (err) {
		console.error("GET PROPERTIES ERROR:", err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch properties" });
	}
};

exports.getAllPropertiesBroker = async (req, res) => {
	try {
		const {
			q,
			category,
			city,
			approvalStatus,
			availabilityStatus,
			minPrice,
			maxPrice,
		} = req.query;
		const filter = {}; // Broker restrictions can go here

		/* SEARCH */
		if (q) {
			filter.$or = [
				{ propertyName: { $regex: q, $options: "i" } },
				{ description: { $regex: q, $options: "i" } },
			];
		}

		/* FILTERS */
		if (category) filter.category = category;
		if (approvalStatus) filter.approvalStatus = approvalStatus;
		if (availabilityStatus) filter.availabilityStatus = availabilityStatus;

		if (city) filter.city = { $regex: city, $options: "i" };

		if (minPrice || maxPrice) {
			filter.priceLakhs = {};
			if (minPrice) filter.priceLakhs.$gte = Number(minPrice);
			if (maxPrice) filter.priceLakhs.$lte = Number(maxPrice);
		}

		const properties = await Property.find(filter).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: properties.length,
			properties,
		});
	} catch (err) {
		console.error("GET BROKER PROPERTIES ERROR:", err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to fetch broker properties" });
	}
};

// ✅ FIXED: Add Property (Crash-Proof Version)
exports.addProperties = async (req, res) => {
	try {
		/* =========================
       FILE HANDLING
    ========================= */
		const cover = req.files?.cover ? req.files.cover[0].path : null;

		const gallery =
			req.files?.gallery ? req.files.gallery.map((f) => f.path) : [];
		const documents =
			req.files?.documents ? req.files.documents.map((f) => f.path) : [];
		const map = req.files?.map ? req.files.map[0].path : null;
		const floorPlan = req.files?.floorPlan ? req.files.floorPlan[0].path : null;

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
       ✅ FIX 1: NAME GENERATION
       Always ensure we have a name. Auto-generate if missing.
    ========================= */
		let propertyName = req.body.propertyName;

		if (!propertyName) {
			// Construct a name like "Residential Flat" from category/type
			const catPart =
				req.body.category ?
					req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1)
				:	"Property";
			const typePart =
				req.body.propertyType ?
					req.body.propertyType
						.replace(/_/g, " ")
						.replace(/\b\w/g, (c) => c.toUpperCase())
				:	"";
			propertyName = `${catPart} ${typePart}`.trim();
		}

		/* =========================
       ✅ FIX 2: OWNERSHIP SAFETY CHECK
       If title is NOT "FREEHOLD" or "LEASEHOLD", ignore it.
       This prevents the "ValidatorError" crash.
    ========================= */
		let validTitle = req.body.propertyTitle;
		const validTitles = ["FREEHOLD", "LEASEHOLD"];

		if (validTitle && !validTitles.includes(validTitle)) {
			// Bonus: If user accidentally typed the Name into the Title field, let's capture it!
			if (propertyName === "Property " || propertyName === " ") {
				propertyName = validTitle;
			}
			validTitle = undefined; // Set to undefined so Mongoose doesn't crash
		}

		/* =========================
       CREATE PROPERTY
    ========================= */
		const property = await Property.create({
			/* BASIC */
			propertyName: propertyName,
			propertyTitle: validTitle, // ✅ Now Safe
			category: req.body.category,
			propertyType: req.body.propertyType,
			description: req.body.description,

			/* DATES */
			propertyAddedDate: new Date(),
			propertyCode: `PROP-${Date.now()}`,

			/* CONFIG */
			bhk: req.body.bhk,
			layout: req.body.layout,
			bedrooms: req.body.bedrooms,
			bathrooms: req.body.bathrooms,
			balconies: req.body.balconies,
			floorNumber: req.body.floorNumber,
			totalFloors: req.body.totalFloors,

			/* PRICING */
			areaSqFt: req.body.areaSqFt,
			priceLakhs: req.body.priceLakhs,
			netPrice: req.body.netPrice,
			demand: req.body.demand,

			/* FURNISHING */
			facing: req.body.facing,
			furnishing: req.body.furnishing,

			/* LOCATION */
			city: req.body.city,
			sector: req.body.sector,
			block: req.body.block,
			pocket: req.body.pocket,
			road: req.body.road,
			locality: req.body.locality,
			address: req.body.address,
			pincode: req.body.pincode,
			mapLocationText: req.body.mapLocationText,

			/* STATUS */
			status: "active",
			availabilityStatus: req.body.availabilityStatus || "available",
			legalStatus: req.body.legalStatus,
			approvalStatus: req.body.approvalStatus || "pending",

			/* EXTRA */
			propertySource: req.body.propertySource,
			comments: req.body.comments,
			parkingStatus: req.body.parkingStatus,

			/* DEALER */
			dealerType: req.body.dealerType,
			dealerName: req.body.dealerName,
			dealerMobile: req.body.dealerMobile,
			dealerSource: req.body.dealerSource,
			referredBy: req.body.referredBy,

			customFields,
			amenities,

			/* MEDIA */
			cover,
			gallery,
			map,
			floorPlan,
			documents,

			/* AUDIT */
			createdBy: req.user ? req.user._id : null,
			approvedBy:
				req.body.approvalStatus === "approved" && req.user ?
					req.user._id
				:	null,
			approvedAt: req.body.approvalStatus === "approved" ? new Date() : null,
		});

		return res.status(201).json({
			success: true,
			message: "Property added successfully",
			property,
		});
	} catch (err) {
		console.error("ADD PROPERTY ERROR:", err); // Logs specific error to console
		return res.status(500).json({
			success: false,
			message: "Failed to add property. Check server console.",
		});
	}
};

exports.PropertyDetails = async (req, res) => {
	const { id } = req.params;
	try {
		const property = await Property.findById(id);
		if (!property)
			return res.status(404).json({ success: false, message: "Not found" });
		res.json(property);
	} catch (err) {
		res.status(500).json({ message: "Error fetching details" });
	}
};

exports.getPropertyEdit = async (req, res) => {
	const { id } = req.params;
	res.json({ message: `Edit property ${id}` });
};

exports.getPropertyEditUpdate = async (req, res) => {
	const { id } = req.params;
	res.json({ message: `Property ${id} updated` });
};
