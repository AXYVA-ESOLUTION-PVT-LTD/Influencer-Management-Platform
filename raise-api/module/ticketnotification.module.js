const mongoose = require("mongoose");

const ticketNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title is required"],
    },
    description: {
      type: String,
      require: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: ["Approved", "Declined", "On Hold"],
      default: "On Hold",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketNotification", ticketNotificationSchema);
