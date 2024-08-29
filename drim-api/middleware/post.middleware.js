const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant");

const validatePost = [
  check("title")
    .exists()
    .withMessage("title is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("title cannot be empty!"),
  check("media")
    .exists()
    .withMessage("media is required!")
    .bail()
    .isArray()
    .withMessage("media must be an array")
    .custom((value) => value.length)
    .withMessage("media cannot be empty!")
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage("media must be an array of strings"),
];

async function validatePostRole(req, res, next) {
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
  }
  if (
    user.roleId.name === "Client" ||
    user.roleId.name === "Influencer" ||
    user.roleId.name === "Admin"
  ) {
    req.user = user;
    next();
  } else {
    return res.status(403).send({
      success: CONSTANT.FAIL,
      message: "You don't have rights to perform this task",
    });
  }
}

module.exports = { validatePost, validatePostRole };
