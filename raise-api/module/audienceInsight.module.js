const mongoose = require('mongoose');

const AudienceInsightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ageDemographics: [
      {
        name: String, 
        y: Number, 
      },
    ],
    genderDemographics: [
      {
        name: String, 
        y: Number, 
      },
    ],
    countryViews: [
      {
        name: String, 
        y: Number, 
      },
    ],
  },
  { timestamps: true } 
);

const AudienceInsight = mongoose.model('AudienceInsight', AudienceInsightSchema);

module.exports = AudienceInsight;
