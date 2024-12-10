const express = require("express");

const auth = require("../config/authentication");

const Chat = require("../controllers/chat.controller");
const ChatMiddleware = require("../middleware/chat.middleware");

const router = express.Router();

router.post(
  "/createChat",
  auth,
  ChatMiddleware.validateCreateChat,
  ChatMiddleware.validateUser,
  Chat.createChat
);
router.post(
  "/getChat",
  auth,
  ChatMiddleware.validateGetChat,
  ChatMiddleware.validateUser,
  Chat.getChat
);

module.exports = router;
