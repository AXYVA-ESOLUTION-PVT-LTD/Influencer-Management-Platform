const express = require("express");
const { auth, authCallback, getFacebookUserData, MonthlyPerformanceFacebookAnalytics } = require("../controllers/facebook.controller");

const router = express.Router();

router.get("/auth/:token", auth);
router.get("/authCallback", authCallback);
router.post("/getuserdata", getFacebookUserData);
router.get("/monthlyPerformanceAnalytics", MonthlyPerformanceFacebookAnalytics);

module.exports = router;
