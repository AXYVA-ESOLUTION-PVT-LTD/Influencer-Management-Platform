const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roleId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: "User",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
