const Opportunity = require("../controllers/opportunity.controller");
const express = require("express");
const OpportunityMiddleware = require("../middleware/opportunity.middleware");
const auth = require("../config/authentication");

const router = express.Router();

// Create Opportunity
router.post(
  "/createOpportunity",
  OpportunityMiddleware.validateOpportunity,
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.addOpportunity
);

// discuss if pagination or not
// Get All Opportunity
router.post(
  "/getOpportunity",
  auth,
  // OpportunityMiddleware.validateAdmin,
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
router.put(
  "/:id",
  OpportunityMiddleware.validateOpportunity,
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.updateOpportunity
);

router.post(
  "/uploadOpportunityImage",
  auth,
  OpportunityMiddleware.validateAdmin,
  Opportunity.uploadOpportunityImage
);

router.post(
  "/removeOpportunityImage",
  auth,
  OpportunityMiddleware.validateAdmin,
  OpportunityMiddleware.validateOpportunityFileName,
  Opportunity.removeOpportunityImage
);

module.exports = router;
