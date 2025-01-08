const express = require("express");
const router = express.Router();
const auth = require("../config/authentication");
const { addPayment, deletePayment, updatePayment, getPaymentMethod, getPaymentDetails, getAllPaymentDetails, getSecurePaymentDetails } = require("../controllers/payment.controller");

router.post("/addPaymentDetails", auth, addPayment);
router.delete("/removePaymentDetails", auth, deletePayment);
router.post("/updatePaymentDetails", auth, updatePayment);
router.get("/getPaymentMethod", auth, getPaymentMethod);
router.post("/getPaymentDetail", auth, getPaymentDetails);
router.get("/getAllPaymentDetail", auth, getAllPaymentDetails);
router.post("/getAllSecurePaymentDetail", auth, getSecurePaymentDetails);

module.exports = router;
