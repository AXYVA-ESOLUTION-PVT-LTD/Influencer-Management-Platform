
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["Pending", "Declined", "Approved"],
      default: "Pending",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);