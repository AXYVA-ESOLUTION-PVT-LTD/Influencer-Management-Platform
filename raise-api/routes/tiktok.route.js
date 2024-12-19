const express = require("express");
const { auth, authCallback } = require("../controllers/tiktok.controller");

const router = express.Router();

router.get("/auth", auth);
router.get("/authCallback", authCallback);


module.exports = router;
