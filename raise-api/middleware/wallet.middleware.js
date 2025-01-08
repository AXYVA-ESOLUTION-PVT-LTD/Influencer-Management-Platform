const { check } = require("express-validator");
const CONSTANT = require("../config/constant");

const validateWallet = [
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
  check("balance")
    .exists()
    .withMessage("Balance is required!")
    .bail()
    .isNumeric()
    .withMessage("Balance must be a valid number!")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Balance must be greater than 0!")
    .trim()
];

async function validateAdmin(req, res, next) {
  const { roleId } = req.decoded;
  if (roleId.name !== "Admin") {
    return res.status(403).send({
      success: CONSTANT.FAIL,
      message: "Only Admin can access this!",
    });
  } else {
    next();
  }
}

module.exports = { validateWallet, validateAdmin };