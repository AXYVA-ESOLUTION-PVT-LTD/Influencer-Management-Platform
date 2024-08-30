const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant");

const validateCreateClient = [
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

const validateGetClient = [
  check("roleName")
    .exists()
    .withMessage("Role name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Role name cannot be empty!"),
];

const validateUpdateClient = [
  check("roleName")
    .exists()
    .withMessage("Role name is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Role name cannot be empty!"),
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
      message: "Only Admin can add Influencer",
    });
  } else {
    next();
  }
}

module.exports = {
  validateCreateClient,
  validateAdmin,
  validateGetClient,
  validateUpdateClient,
};
