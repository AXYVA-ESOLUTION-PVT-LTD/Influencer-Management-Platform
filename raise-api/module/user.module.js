const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    roleId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    profilePhoto: { type: String, default: "" },
    appId: { type: String, default: "" },
    loginType: { type: String, default: "" },
    status: { type: Boolean },
  },
  {
    collection: "User",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
