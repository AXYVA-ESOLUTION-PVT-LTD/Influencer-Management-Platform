const mongoose = require("mongoose");
const roleSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: "Role",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Role", roleSchema);
