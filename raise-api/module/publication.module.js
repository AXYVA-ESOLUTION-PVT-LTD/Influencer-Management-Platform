
const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Declined", "Cancelled", "Published"],
      default: "Pending",
    },
    publicationLink: {
      type: String,
      trim: true,
    },
    screenshot: {
      type: String,
      trim: true,
      trim: true,
      default: "" 
    },
    engagementRate: {
      type: Number,
      trim: true,
    },
    followerCount: {
      type: Number,
    },
    likeCount: {
      type: Number,
    },
    commentCount: {
      type: Number,
    },
    shareCount: {
      type: Number,
    },
    viewCount: {
      type: Number,
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Publication", PublicationSchema);
