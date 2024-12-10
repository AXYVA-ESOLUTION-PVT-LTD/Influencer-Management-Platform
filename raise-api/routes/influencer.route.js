const express = require("express");
const Influencer = require("../controllers/influencer.controller");
const InfluencerMiddleware = require("../middleware/influencer.middleware");
const auth = require("../config/authentication");

const router = express.Router();

// Create Influencer
router.post(
  "/createInfluencer",
  InfluencerMiddleware.validateCreateInfluencer,
  auth,
  InfluencerMiddleware.validateAdmin,
  Influencer.addInfluencer
);
// Get Influencer
router.post(
  "/getInfluencers",
  InfluencerMiddleware.validateGetInfluencers,
  auth,
  InfluencerMiddleware.validateAdmin,
  Influencer.getInfluencers
);
// Get Influencer
router.put(
  "/:id",
  InfluencerMiddleware.validateUpdateInfluencers,
  auth,
  InfluencerMiddleware.validateAdmin,
  Influencer.updateInfluencer
);

module.exports = router;
