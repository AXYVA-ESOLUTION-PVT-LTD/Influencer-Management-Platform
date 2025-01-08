const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const CHAT_COLLECTION = require("../module/chat.module");

const json = {};

exports.createChat = _createChat;
exports.getChat = _getChat;

/*
TYPE: Post
TODO: Create Chat
*/

async function _createChat(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    }

    const { message, type, ticketId, transactionId } = req.body;
    const user = req.user;

    const chat = await CHAT_COLLECTION.create({
      message,
      sender: user._id,
      type,
      ticketId,
      transactionId
    });
    if (!chat) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Create Chat",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "chat created Successfully",
      data: {
        chat,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: chat | Method: _createChat | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while creating chat",
      error: e,
    };
    return res.send(json);
  }
}

/*
  TYPE: Post
  TODO: Get Chat
  */
async function _getChat(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    }
    var query = {};
    const { type, ticketId, transactionId } = req.body;
    if(type == "Transaction"){
      query = { transactionId: transactionId };
    }
    if(type == "Ticket"){
      query = { ticketId: ticketId };
    }

    const chats = await CHAT_COLLECTION.find(query).sort({ createdAt: 1 });
    if (!chats) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to get Chat",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "chat Fetched Successfully",
      data: {
        chats,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: chat | Method: _getChat | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while creating chat",
      error: e,
    };
    return res.send(json);
  }
}
