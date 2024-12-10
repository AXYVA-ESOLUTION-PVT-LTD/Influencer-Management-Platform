const Ticket = require("../controllers/ticket.controller");
const express = require("express");
const router = express.Router();
const { ticket } = require("../middleware/ticket.middleware");
const auth = require("../config/authentication");

router.post("/createTicket", auth, ticket, Ticket.createTicket);
router.get("/getTicketById/:id", auth, Ticket.getTicketById);
router.post("/getTickets", auth, Ticket.getTickets);
router.put("/updateTicketById/:id", auth, ticket, Ticket.updateTicketById);
router.delete("/removeTicketById/:id", auth, Ticket.removeTicketById);

module.exports = router;
