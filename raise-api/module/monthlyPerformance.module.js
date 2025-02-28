const mongoose = require('mongoose');

const MonthlyPerformanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    monthlyPostCount: {
      type: [Number], 
      default: Array(12).fill(0), 
    },
    monthlyEngagementRate: {
      type: [Number], 
      default: Array(12).fill(0),
    },
    monthlyCommentCount: {
      type: [Number], 
      default: Array(12).fill(0),
    },
  },
  { timestamps: true } 
);

const MonthlyPerformance = mongoose.model('MonthlyPerformance', MonthlyPerformanceSchema);

module.exports = MonthlyPerformance;
