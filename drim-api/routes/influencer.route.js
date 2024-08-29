const express = require("express");
const Influencer = require("../controllers/influencer.controller");
const InfluencerMiddleware = require("../middleware/influencer.middleware");
const auth = require("../config/authentication");

const router = express.Router();

// Create Opportunity
router.post(
  "/createInfluencer",
  InfluencerMiddleware.validateInfluencer,
  auth,
  InfluencerMiddleware.validateAdmin,
  Influencer.addInfluencer
);

module.exports = router;
