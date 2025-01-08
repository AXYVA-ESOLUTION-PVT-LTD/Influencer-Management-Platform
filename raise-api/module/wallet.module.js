
const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Wallet", WalletSchema);
