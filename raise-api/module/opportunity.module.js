const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      default: "Active",
    },
    views: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
