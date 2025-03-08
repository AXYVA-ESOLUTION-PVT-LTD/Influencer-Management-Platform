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
  // InfluencerMiddleware.validateAdmin,
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

// 1. Get Influencer Profile Data
router.post("/influencer-profile/:id", auth, Influencer.getUserProfileData);

// 2. Get Influencer Basic Data
router.post("/influencer-basics/:id", auth, Influencer.getUserBasicData);

// 3. Get Influencer Post Statistics Data
router.post(
  "/influencer-statistics/:id",
  auth,
  Influencer.getUserPostStatisticsData
);

// 4. Get Influencer Monthly Statistics Data
router.post(
  "/influencer-monthly-statistics/:id",
  auth,
  Influencer.getUserMonthlyStatisticsData
);

// 5. Get Influencer Demographic Data
router.post(
  "/influencer-demographics/:id",
  auth,
  Influencer.getUserDemographicStatistics
);

// 6. Get Influencer Publication Data
router.post(
  "/influencer-publications/:id",
  auth,
  Influencer.getUserPublicationData
);

// 7. Get Influencer Media Data
router.post("/influencer-media/:id", auth, Influencer.getUserMediaData);



module.exports = router;
