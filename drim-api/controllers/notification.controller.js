const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");

const NOTIFICATION_COLLECTION = require("../module/notification.module");

const json = {};

exports.createNotification = _createNotification;
exports.getNotifications = _getNotifications;
exports.updateNotification = _updateNotification;

/*
TYPE: Post
TODO: Create Notification
*/
async function _createNotification(req, res) {
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

    const { title, description } = req.body;
    const user = req.user;
    const notification = await NOTIFICATION_COLLECTION.create({
      title,
      description,
      from: user._id,
    });
    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Create Notification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification created Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _createNotification | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while creating notification",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get Notifications
*/
async function _getNotifications(req, res) {
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

    const user = req.user;
    let notifications;
    if (user.roleId.name === "Admin") {
      notifications = await NOTIFICATION_COLLECTION.find();
    } else {
      notifications = await NOTIFICATION_COLLECTION.find({
        from: user._id,
      });
    }

    if (!notifications) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Get Notification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification fetched Successfully",
      data: {
        notifications,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _getNotifications | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while fetching notification",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get Notifications
*/
async function _updateNotification(req, res) {
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

    const { status } = req.body;
    const { id } = req.params;

    const notification = await NOTIFICATION_COLLECTION.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Update Notification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification updated Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _updateNotification | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while updating notification",
      error: e,
    };
    return res.send(json);
  }
}
