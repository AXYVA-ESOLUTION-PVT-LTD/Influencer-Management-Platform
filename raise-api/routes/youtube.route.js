const express = require("express");
const {
  youtubeAuth,
  youtubeAuthCallback,
  getYouTubeDemographics,
  getYouTubeAnalytics,
  fetchYouTubeChannelStats
} = require("../controllers/youtube.controller");

const router = express.Router();

router.get("/auth/:token", youtubeAuth);
router.get("/authCallback", youtubeAuthCallback);
router.get("/getUserData", fetchYouTubeChannelStats);
router.get("/MonthlyPerformanceAnalytics", getYouTubeAnalytics);
router.get("/demographics", getYouTubeDemographics);

module.exports = router;
