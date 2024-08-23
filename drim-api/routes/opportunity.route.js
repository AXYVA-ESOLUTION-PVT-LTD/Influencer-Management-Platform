const Opportunity = require("../controllers/opportunity.controller");
const express = require("express");
const OpportunityMiddleware = require("../middleware/opportunity.middleware");
const auth = require("../config/authentication");

const router = express.Router();

// Create Opportunity
router.post(
  "/",
  OpportunityMiddleware.validateOpportunity,
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.addOpportunity
);

// discuss if pagination or not
// Get All Opportunity
router.get(
  "/",
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.getOpportunity
);

// Delete Opportunity by Id
router.delete(
  "/:id",
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.deleteOpportunity
);

// Update Opportunity by Id
router.patch(
  "/:id",
  OpportunityMiddleware.validateOpportunity,
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.updateOpportunity
);

module.exports = router;
