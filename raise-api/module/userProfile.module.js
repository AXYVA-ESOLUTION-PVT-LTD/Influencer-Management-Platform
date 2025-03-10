const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    name: { type: String },
    platform: { type: String },
    description: { type: String },
    category: { type: String },
    profile_link: { type: String },
    picture_url: { type: String },
    fan_count: { type: Number, default: 0 }, //Facebook Page
    follower_count: { type: Number, default: 0 }, //Facebook Page & Instagram Account
    follows_count: { type: Number, default: 0 }, //Instagram Account 
    subscriber_count: { type: Number, default: 0 }, //YouTube channel
    total_views: { type: Number, default: 0 }, //YouTube channel
    total_videos: { type: Number, default: 0 }, //YouTube channel
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
