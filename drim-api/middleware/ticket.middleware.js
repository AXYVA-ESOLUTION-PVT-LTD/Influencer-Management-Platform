const { check } = require("express-validator");

const ticket = [
  check("influencerId")
    .exists()
    .withMessage("Influencer id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Influencer id cannot be empty!")
    .bail()
    .isMongoId()
    .withMessage("Influencer id must be a valid MongoDB ObjectId"),

  check("opportunityId")
    .exists()
    .withMessage("Opportunity id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Opportunity id cannot be empty!")
    .bail()
    .isMongoId()
    .withMessage("Opportunity id must be a valid MongoDB ObjectId"),
];

module.exports = { ticket };
