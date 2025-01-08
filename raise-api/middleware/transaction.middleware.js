const { check } = require("express-validator");

const validateAddTransaction = [
  check("amount")
    .exists()
    .withMessage("Amount is required!")
    .bail()
    .isNumeric()
    .withMessage("Amount must be a valid number!")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0!")
    .trim()
];

const validateUpdateTransaction = [
  check("transactionId")
    .exists()
    .withMessage("Transaction id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Transaction id cannot be empty!"),
  check("status")
    .exists()
    .withMessage("Status is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Status cannot be empty!")
    .bail()
    .isIn(["Pending", "Declined", "Approved"])
    .withMessage("Status must be one of the following: Pending, Declined, Approved")
];

module.exports = { validateAddTransaction, validateUpdateTransaction };