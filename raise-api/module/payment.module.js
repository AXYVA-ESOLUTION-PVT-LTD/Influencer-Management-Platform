const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Bank", "GPay", "PayPal"],
      required: true,
    },
    accountHolderName: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    ifscCode: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    branchName: {
      type: String,
      default: "",
    },
    upiId: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
