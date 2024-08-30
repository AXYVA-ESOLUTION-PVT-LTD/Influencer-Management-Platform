const User = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
const {
  addUser,
  updateUser,
  validateEmail,
  validateOTP,
  validateChangePassword,
  validateResetPassword,
  updateProfile,
  validateUpdateProfile,
} = require("../middleware/user.middleware");
const auth = require("../config/authentication");
const upload = require("../middleware/multer.middleware");

// Login and Sign Up
router.post("/login", User.login);
router.post("/signUp", addUser, User.signUp);

// update profile
router.post(
  "/updateProfile",
  validateUpdateProfile,
  auth,
  upload.single("profilePhoto"),
  User.updateProfile
);

// Forgot Password
router.post("/forgotPassword", validateEmail, User.forgotPassword);
router.post("/OTPVerfication", validateOTP, User.OTPVerification);
router.post("/changePassword", validateChangePassword, User.changePassword);

// Reset Password
router.post("/resetPassword", auth, validateResetPassword, User.resetPassword);

// CRUD on User
router.post("/getUsers", auth, User.getUsers);
router.get("/getUserById/:id", auth, User.getUserById);
router.post("/updateUserById/:id", auth, updateUser, User.updateUserById);
router.get("/deleteUserById/:id", auth, User.deleteUserById);

module.exports = router;
