const express = require("express");
const { auth, authCallback, webHookAuthCallback, getInstagramUserData, MonthlyPerformanceInstagramAnalytics, getInstagramDemographics } = require("../controllers/instagram.controller");

const router = express.Router();

router.get("/auth/:token", auth);
router.get("/authCallback", authCallback);
router.get('/webhook',webHookAuthCallback);
router.post('/getUserData',getInstagramUserData);
router.get('/MonthlyPerformanceInstagramAnalytics',MonthlyPerformanceInstagramAnalytics);
router.get('/Demographics',getInstagramDemographics);

module.exports = router;
