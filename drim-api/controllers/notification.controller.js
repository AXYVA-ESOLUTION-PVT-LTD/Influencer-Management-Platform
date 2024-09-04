const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");

const NOTIFICATION_COLLECTION = require("../module/notification.module");

const json = {};

exports.createNotification = _createNotification;
exports.getNotifications = _getNotifications;
exports.updateNotification = _updateNotification;
exports.deleteNotification = _deleteNotification;

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

    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;

    const user = req.user;

    let query = {};
    let sort = {};

    const { title, description, status, sortBy, sortOrder, firstName, email } =
      req.body;

    if (title) {
      query.title = { $regex: `^${title}`, $options: "i" };
    }
    if (description) {
      query.description = { $regex: `^${description}`, $options: "i" };
    }
    if (status) {
      query.status = { $regex: `^${status}`, $options: "i" };
    }

    if (sortBy) {
      sort[sortBy] = sortOrder === 1 ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    if (user.roleId.name === "Influencer") {
      query.from = user._id.toString();
    }

    const notifications = await NOTIFICATION_COLLECTION.find(query)
      .collation({
        locale: "en",
        caseLevel: true,
      })
      .populate({ path: "from", model: "User", select: ["email", "firstName"] })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const totalNotifications = await NOTIFICATION_COLLECTION.countDocuments(
      query
    );

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
        totalNotifications,
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
TYPE: Put
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

/*
TYPE: Delete
TODO: Delete Notification
*/
async function _deleteNotification(req, res) {
  try {
    const { id } = req.params;

    const notification = await NOTIFICATION_COLLECTION.findOneAndDelete({
      _id: id,
    });

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Delete Notification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification deleted Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _deleteNotification | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while deleting notification",
      error: e,
    };
    return res.send(json);
  }
}
