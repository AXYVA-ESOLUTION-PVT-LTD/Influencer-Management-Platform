const express = require("express");

const BrandMiddleware = require("../middleware/brand.middleware");

const auth = require("../config/authentication");

const Brand = require("../controllers/brand.controller");

const router = express.Router();

// get Brand
router.post(
  "/getBrands",
  BrandMiddleware.validateGetBrand,
  auth,
  BrandMiddleware.validateAdmin,
  Brand.getBrand
);

// Create Brand
router.post(
  "/createBrand",
  BrandMiddleware.validateCreateBrand,
  auth,
  BrandMiddleware.validateAdmin,
  Brand.addBrand
);

// Update Brand
router.put(
  "/:id",
  BrandMiddleware.validateUpdateBrand,
  auth,
  BrandMiddleware.validateAdmin,
  Brand.updateBrandById
);

// Get Brand Data Statistics
router.post("/getBrandDataStatistics", auth, Brand.getBrandDataStatistics);

// Get opportunity Statistics
router.post("/getOpportunityStatistics", auth, Brand.getOpportunityStatistics);

// Get Influencers Statistics
router.post("/getInflucersStatistics", auth, Brand.getInfluencersStatistics);

// Get Brand Influencer Statistics
router.post(
  "/getInfluencerStatisticsByPlatform",
  auth,
  Brand.getBrandInfluencerStatistics
);

// Get Brand Influencer Statistics
router.post(
  "/getInfluencerStatisticsByCountry",
  auth,
  Brand.getBrandInfluencerStatisticsByCountry
);

// Get AllPublications By Brand
router.post(
  "/getAllPublicationsByBrand",
  auth,
  Brand.getAllPublicationsByBrand
);

module.exports = router;
