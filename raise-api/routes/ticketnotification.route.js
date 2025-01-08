const express = require("express");

const TicketNotificationMiddleware = require("../middleware/ticketnotification.middleware");

const auth = require("../config/authentication");

const TicketNotification = require("../controllers/ticketnotification.controller");

const router = express.Router();

// get Ticket Notification
router.post(
  "/getTicketNotification",
  auth,
  TicketNotificationMiddleware.validateUser,
  TicketNotification.getTicketNotifications
);

// Create Ticket Notification
router.post(
  "/createTicketNotification",
  TicketNotificationMiddleware.validateCreateTicketNotification,
  auth,
  TicketNotificationMiddleware.validateUser,
  TicketNotification.createTicketNotification
);

// Update Ticket Notification
router.put(
  "/:id",
  TicketNotificationMiddleware.validateUpdateTicketNotification,
  auth,
  TicketNotificationMiddleware.validateAdmin,
  TicketNotification.updateTicketNotification
);

// Delete Ticket Notification
router.delete(
  "/:id",
  auth,
  TicketNotificationMiddleware.validateAdmin,
  TicketNotification.deleteTicketNotification
);

router.get(
  "/getTicketEngagementStatistics",
  auth,
  TicketNotification.getTicketEngagementStatistics
);

module.exports = router;
