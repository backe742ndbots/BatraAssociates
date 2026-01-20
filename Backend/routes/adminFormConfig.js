const router = require("express").Router();
const FormConfig = require("../models/FormConfig");

/* GET PROPERTY FORM CONFIG */
router.get("/admin/form-config/property", async (req, res) => {
  const config = await FormConfig.findOne({ formKey: "property_form" });
  res.json(config);
});

/* UPDATE FULL CONFIG */
router.put("/admin/form-config/property", async (req, res) => {
  const updated = await FormConfig.findOneAndUpdate(
    { formKey: "property_form" },
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
