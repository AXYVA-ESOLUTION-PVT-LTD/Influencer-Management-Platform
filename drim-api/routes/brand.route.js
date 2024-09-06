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

module.exports = router;
