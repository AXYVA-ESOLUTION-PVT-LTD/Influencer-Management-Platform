const express = require("express");
const router = express.Router();
const auth = require("../config/authentication");
const Platform = require("../controllers/platform.controller");

router.post("/youtube", auth, Platform.YouTubeData);

router.post("/instagram", auth, Platform.InstagramData);

router.post("/tiktok", auth, Platform.TikTokData);

module.exports = router;
