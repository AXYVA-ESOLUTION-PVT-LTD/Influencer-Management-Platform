const { 
    createTransaction, 
    getTransactionById, 
    getTransactions, 
    removeScreenshotById, 
    removeTransactionById, 
    updateTransactionDetailById
  } = require("../controllers/transaction.controller");
  const express = require("express");
  const router = express.Router();
  const { validateAddTransaction, validateUpdateTransaction } = require("../middleware/transaction.middleware");
  const auth = require("../config/authentication");
  
  router.post("/createTransaction", auth, validateAddTransaction, createTransaction);
  router.get("/getTransactionById/:id", auth, getTransactionById);
  router.post("/getTransactions", auth, getTransactions);
  router.post("/updateTransactionDetailById/:id", auth, validateUpdateTransaction, updateTransactionDetailById);
  router.get("/removeTransactionById/:id", auth, removeTransactionById);
  router.post("/removeScreenshotById/:id", auth, removeScreenshotById);
  
  module.exports = router;
  