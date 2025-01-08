const express = require("express");
const { auth, authCallback, getTikTokUserData, MonthlyPerformanceTikTokAnalytics } = require("../controllers/tiktok.controller");

const router = express.Router();

router.get("/auth/:token", auth);
router.get("/authCallback", authCallback);
router.post("/getuserdata", getTikTokUserData);
router.get("/monthlyPerformanceAnalytics", MonthlyPerformanceTikTokAnalytics);

module.exports = router;
