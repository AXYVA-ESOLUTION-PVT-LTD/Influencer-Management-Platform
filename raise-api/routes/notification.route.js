const express = require("express");

const router = express.Router();

const Notification = require("../controllers/notification.controller");

const auth = require("../config/authentication");



// Create notification
router.post(
  "/createNotification",
  auth,
  Notification.createNotification
);

// Fetch unread notifications for a specific user
router.get(
  "/getUnreadNotifications",
  auth,
  Notification.getUnreadNotifications
);

// Mark a specific notification as read
router.patch(
  "/markNotificationAsRead/:id",
  auth,
  Notification.getNotifications
);


module.exports = router;
