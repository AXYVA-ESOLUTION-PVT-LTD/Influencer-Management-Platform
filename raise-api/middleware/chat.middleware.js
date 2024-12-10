const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant");

const validateCreateChat = [
  check("ticketId")
    .exists()
    .withMessage("Ticket Id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Ticket Id cannot be empty!"),
  check("message")
    .exists()
    .withMessage("Message is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Message cannot be empty!"),
];
const validateGetChat = [
  check("ticketId")
    .exists()
    .withMessage("Ticket Id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Ticket Id cannot be empty!"),
];

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
  validateCreateChat,
  validateGetChat,
  validateUser,
};
