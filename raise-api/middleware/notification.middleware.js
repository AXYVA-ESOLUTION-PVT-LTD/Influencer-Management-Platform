const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant");

const validateCreateNotification = [
  check("title")
    .exists()
    .withMessage("Title is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Title cannot be empty!"),
  check("description")
    .exists()
    .withMessage("Description is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Description cannot be empty!"),
];
const validateUpdateNotification = [
  check("status")
    .exists()
    .withMessage("Status is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Status cannot be empty!"),
];

async function validateAdmin(req, res, next) {
  const { email } = req.decoded;
  const user = await USER_COLLECTION.findOne(
    { email: email },
    { roleId: 1, email: 1 }
  ).populate({
    path: "roleId",
    model: "Role",
    select: ["name"],
  });
  if (!user) {
    return res.status(403).send({
      success: CONSTANT.FAIL,
      message: "user does not exits",
    });
  } else if (user.roleId.name !== "Admin") {
    return res.status(403).send({
      success: CONSTANT.FAIL,
      message: "Only Admin can Update notification",
    });
  } else {
    next();
  }
}

async function validateUser(req, res, next) {
  const { email } = req.decoded;
  const user = await USER_COLLECTION.findOne(
    { email: email },
    { roleId: 1, email: 1 }
  ).populate({
    path: "roleId",
    model: "Role",
    select: ["name"],
  });
  if (!user) {
    return res.status(403).send({
      success: CONSTANT.FAIL,
      message: "user does not exits",
    });
  } else {
    req.user = user;
    next();
  }
}
module.exports = {
  validateCreateNotification,
  validateUpdateNotification,
  validateAdmin,
  validateUser,
};
