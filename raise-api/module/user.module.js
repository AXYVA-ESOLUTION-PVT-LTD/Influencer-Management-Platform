const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String},
    roleId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    profilePhoto: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  {
    collection: "User",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
