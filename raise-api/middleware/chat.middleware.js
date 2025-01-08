const { check } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant");

const validateCreateChat = [
  check("type")
    .exists()
    .withMessage("Type is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Type cannot be empty!")
    .bail()
    .isIn(["Transaction", "Ticket"])
    .withMessage("Type must be one of the following: Transaction, Ticket"),
  // check("ticketId")
  //   .exists()
  //   .withMessage("Ticket Id is required!")
  //   .bail()
  //   .trim()
  //   .isString()
  //   .notEmpty()
  //   .withMessage("Ticket Id cannot be empty!"),
  check("message")
    .exists()
    .withMessage("Message is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Message cannot be empty!"),
  check("ticketId").custom((value, { req }) => {
    if (req.body.type === "Ticket") {
      if (!value || value.trim() === "") {
        throw new Error("Ticket Id is required when type is ticket!");
      }
    }
    return true;
  }),
  check("transactionId").custom((value, { req }) => {
    if (req.body.type === "Transaction") {
      if (!value || value.trim() === "") {
        throw new Error("Transaction id is required when type is transaction!");
      }
    }
    return true;
  }),
  
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
