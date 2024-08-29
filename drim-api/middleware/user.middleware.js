const { check, validationResult } = require("express-validator");

const updateUser = [
  check("firstName")
    .exists()
    .withMessage("First name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("First name cannot be empty!"),
  check("lastName")
    .exists()
    .withMessage("Last name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Last name cannot be empty!"),
  check("email")
    .exists()
    .withMessage("email is required!")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Please enter valid Email"),
];

const updateProfile = [
  check("firstName")
    .exists()
    .withMessage("First name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("First name cannot be empty!"),

  check("lastName")
    .exists()
    .withMessage("Last name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Last name cannot be empty!"),

  check("email")
    .exists()
    .withMessage("email is required!")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Please enter valid Email"),
];

const addUser = [
  ...updateUser,
  check("password")
    .exists()
    .withMessage("Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Password cannot be empty!"),
];

const validateEmail = [
  check("email")
    .exists()
    .withMessage("email is required!")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Please enter valid Email"),
];

const validateOTP = [
  check("email")
    .exists()
    .withMessage("email is required!")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .bail()
    .isEmail()
    .withMessage("Please enter valid Email"),
  check("otp")
    .exists()
    .withMessage("OTP is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("OTP cannot be empty!"),
];

const validateChangePassword = [
  check("token")
    .exists()
    .withMessage("token required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("tokencannot be empty!"),
  check("password")
    .exists()
    .withMessage("New Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("New Password cannot be empty!"),
  check("confirmPassword")
    .exists()
    .withMessage("Confirm Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Confirm Password cannot be empty!"),
];

const validateResetPassword = [
  check("oldPassword")
    .exists()
    .withMessage("Old Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Old Password cannot be empty!"),
  check("newPassword")
    .exists()
    .withMessage("New Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("New Password cannot be empty!"),
  check("confirmPassword")
    .exists()
    .withMessage("Confirm Password is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Confirm Password cannot be empty!"),
];

module.exports = {
  addUser,
  updateUser,
  validateEmail,
  validateOTP,
  validateResetPassword,
  validateChangePassword,
  updateProfile,
};
