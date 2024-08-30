const express = require("express");

const ClientMiddleware = require("../middleware/client.middleware");

const auth = require("../config/authentication");

const Client = require("../controllers/client.controller");

const router = express.Router();

// get Client
router.post(
  "/getClients",
  ClientMiddleware.validateGetClient,
  auth,
  ClientMiddleware.validateAdmin,
  Client.getClient
);

// Create Client
router.post(
  "/createClient",
  ClientMiddleware.validateCreateClient,
  auth,
  ClientMiddleware.validateAdmin,
  Client.addClient
);

// Update Client
router.put(
  "/:id",
  ClientMiddleware.validateUpdateClient,
  auth,
  ClientMiddleware.validateAdmin,
  Client.updateClientById
);

module.exports = router;
