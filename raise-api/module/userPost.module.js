const mongoose = require("mongoose");

const UserPostSchema = new mongoose.Schema(
  {
    post_id: { type: String, required: true, unique: true },
    post_image_url: { type: String, default: "" },
    post_url: { type: String, required: true },
    post_title: { type: String, default: "" },
    post_created_time: { type: Date, required: true },
    platform: { type: String, default: "" },
    comment_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    share_count: { type: Number, default: 0 },
    view_count: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPost", UserPostSchema);
