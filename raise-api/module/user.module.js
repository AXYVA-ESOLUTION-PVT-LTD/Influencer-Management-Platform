const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, default: "" },
    userId : { type: String, default: "" },
    platform: { type: String, default: "" }, 
    email: { type: String },
    companyName: { type: String },
    phoneNumber: { type: String },
    city: { type: String },
    country: { type: String },
    password: { type: String },
    accessToken : { type: String },
    refreshToken : { type: String },
    expiresIn : { type: String },
    refreshTokenExpireIn : { type: String },
    roleId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type:Boolean ,default: false },
    isBankVerified: { type: Boolean, default: false },
    profilePhoto: { type: String, default: "" },
    status: { type: Boolean, default: false },
  },
  {
    collection: "User",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
