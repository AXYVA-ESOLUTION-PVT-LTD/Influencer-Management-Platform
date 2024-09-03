const express = require("express");

const NotificationMiddleware = require("../middleware/notification.middleware");

const auth = require("../config/authentication");

const Notification = require("../controllers/notification.controller");

const router = express.Router();

// get Notifications
router.post(
  "/getNotifications",
  auth,
  NotificationMiddleware.validateUser,
  Notification.getNotifications
);

// Create Notification
router.post(
  "/createNotification",
  NotificationMiddleware.validateCreateNotification,
  auth,
  NotificationMiddleware.validateUser,
  Notification.createNotification
);

// Update Notification
router.put(
  "/:id",
  NotificationMiddleware.validateUpdateNotification,
  auth,
  NotificationMiddleware.validateAdmin,
  Notification.updateNotification
);

module.exports = router;
