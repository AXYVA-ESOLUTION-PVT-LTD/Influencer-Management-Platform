const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User collection

    tiktok: {
      follower_count: Number,
      likes_count: Number,
      video_count: Number,
      following_count: Number,
    },
    facebook: {
      friends_count: Number,
      totalReactions: Number,
      post_count: Number,
      totalComments: Number,
    },
    instagram: {
      followers_count: Number,
      follows_count: Number,
      totalPosts: Number,
      totalLikes: Number,
    },
    youtube: {
      totalSubscribers: Number,
      totalVideos: Number,
      totalPlaylists: Number,
      totalLikes: Number,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
