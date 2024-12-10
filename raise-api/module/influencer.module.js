const mongoose = require("mongoose");

const influencerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    requirements: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    subscription: {
      type: String,
    },
    subscriber: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    accountActivity: {
      type: String,
    },
    audienceQuality: {
      type: String,
    },
    audienceReachability: {
      type: String,
    },
    advertising: {
      type: Object, // TODO:Object of what?
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "Influencer",
    timestamps: true,
  }
);

module.exports = mongoose.model("Influencer", influencerSchema);
