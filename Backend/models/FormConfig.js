const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      "text",
      "number",
      "textarea",
      "select",
      "checkbox",
      "radio",
      "amenities",
      "file"
    ],
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  required: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  }
});

const PageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fields: {
    type: [FieldSchema],
    default: []
  }
});

const FormConfigSchema = new mongoose.Schema(
  {
    formKey: {
      type: String,
      unique: true,
      required: true
    },
    pages: {
      type: [PageSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormConfig", FormConfigSchema);
