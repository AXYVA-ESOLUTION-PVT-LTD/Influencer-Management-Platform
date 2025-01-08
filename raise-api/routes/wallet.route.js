const Wallet = require("../controllers/wallet.controller");
const express = require("express");
const router = express.Router();
const { validateWallet, validateAdmin } = require("../middleware/wallet.middleware");
const auth = require("../config/authentication");

router.post("/createWallet", auth, validateAdmin, validateWallet, Wallet.createWallet);
router.get("/getWalletById/:id", auth, Wallet.getWalletById);
router.post("/getWallets", auth, Wallet.getWallets);
router.post("/updateWalletById/:id", auth, validateAdmin, validateWallet, Wallet.updateWalletById);
router.get("/removeWalletById/:id", auth, Wallet.removeWalletById);
router.get("/getWalletByInfluencerId/:id", Wallet.getWalletByInfluencerId);

module.exports = router;
