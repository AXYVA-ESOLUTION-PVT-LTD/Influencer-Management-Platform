const NOTIFICATION_COLLECTION = require("../module/notification.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");

// Create a new notification
exports.createNotification = _createNotification;
// Mark a specific notification as read
exports.getNotifications = _getNotifications;
// Fetch unread notifications for a user
exports.getUnreadNotifications = _getUnreadNotifications;
// Delete a notification
exports.deleteNotification = _deleteNotification;

// Create a new notification
async function _createNotification(req, res) {
  const json = {};
  const { userId, title, message } = req.body;
  try {
    if (!userId || !title || !message) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "All fields are required" };
      return res.status(400).send(json);
    }

    const notification = await NOTIFICATION_COLLECTION.create({
      userId,
      title,
      message,
    });

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification created successfully",
      data: notification,
    };
    return res.status(201).send(json);
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to create notification",
      error: error.message,
    };
    return res.status(500).send(json);
  }
}

// Fetch all notifications for a specific user
// async function _getNotifications(req, res) {
//   const json = {};
//   const { userId } = req.params;

//   try {
//     const notifications = await NOTIFICATION_COLLECTION.find({ userId }).sort({
//       createdAt: -1,
//     });
//     if (!notifications.length) {
//       json.status = CONSTANT.FAIL;
//       json.result = { message: "No notifications found" };
//       return res.status(404).send(json);
//     }

//     json.status = CONSTANT.SUCCESS;
//     json.result = {
//       message: "Notifications fetched successfully",
//       data: notifications,
//     };
//     return res.status(200).send(json);
//   } catch (error) {
//     json.status = CONSTANT.FAIL;
//     json.result = {
//       message: "Failed to fetch notifications",
//       error: error.message,
//     };
//     return res.status(500).send(json);
//   }
// }

// Mark a specific notification as read
async function _getNotifications(req, res) {
  const json = {};
  const { id } = req.params;

  try {
    const notification = await NOTIFICATION_COLLECTION.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Notification not found" };
      return res.status(404).send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Notification marked as read successfully",
      data: notification,
    };
    return res.status(200).send(json);
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to mark notification as read",
      error: error.message,
    };
    return res.status(500).send(json);
  }
}

// Fetch unread notifications for a user
async function _getUnreadNotifications(req, res) {
  const json = {};
  const userId = req.decoded.id;
  try {
    const unreadNotifications = await NOTIFICATION_COLLECTION.find({    
      userId,
      isRead: false,
    }).sort({
      createdAt: -1,
    });
    const count = unreadNotifications.length;
    
    // if (!unreadNotifications.length) {
    //   json.status = CONSTANT.FAIL;
    //   json.result = { message: "No unread notifications found" };
    //   return res.status(404).send(json);
    // }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Unread notifications fetched successfully",
      data: unreadNotifications,
      count: count,
    };
    return res.status(200).send(json);
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to fetch unread notifications",
      error: error.message,
    };
    return res.status(500).send(json);
  }
}

// Delete a notification
async function _deleteNotification(req, res) {
  const json = {};
  const { id } = req.params;

  try {
    const deletedNotification = await NOTIFICATION_COLLECTION.findByIdAndDelete(
      id
    );

    if (!deletedNotification) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Notification not found" };
      return res.status(404).send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = { message: "Notification deleted successfully" };
    return res.status(200).send(json);
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to delete notification",
      error: error.message,
    };
    return res.status(500).send(json);
  }
}
