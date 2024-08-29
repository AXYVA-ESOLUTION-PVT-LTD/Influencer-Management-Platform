const express = require("express");

const ClientMiddleware = require("../middleware/client.middleware");

const auth = require("../config/authentication");

const Client = require("../controllers/client.controller");

const router = express.Router();

// Create Opportunity
router.post(
  "/createClient",
  ClientMiddleware.validateClient,
  auth,
  ClientMiddleware.validateAdmin,
  Client.addClient
);

module.exports = router;
