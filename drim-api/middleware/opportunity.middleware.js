const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const ROLE_COLLECTION = require("../module/role.module");
const CONSTANT = require("../config/constant");

const validateOpportunity = [
  check("title")
    .exists()
    .withMessage("title is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("title cannot be empty!"),
  check("type")
    .exists()
    .withMessage("type is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("type cannot be empty!"),
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
      message: "Only Admin can add Oppurtunity",
    });
  } else {
    next();
  }
}

module.exports = { validateOpportunity, validateAdmin };
