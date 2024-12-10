const { validationResult } = require("express-validator");
const TICKET_COLLECTION = require("../module/ticket.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
var json = {};
const jwt = require("jsonwebtoken");

exports.createTicket = _createTicket;
exports.getTicketById = _getTicketById;
exports.getTickets = _getTickets;
exports.updateTicketById = _updateTicketById;
exports.removeTicketById = _removeTicketById;
/*
TYPE: Post
TODO: Create new ticket
*/
async function _createTicket(req, res) {
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
    const { influencerId, opportunityId, description } = req.body;
    const existTicket = await TICKET_COLLECTION.findOne({
      influencerId: influencerId,
      opportunityId: opportunityId
    });
    if (existTicket) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Ticket already exists with this opportunity!",
        error: "Ticket already exists with this opportunity!",
      };
      return res.send(json);
    }

    const newTicket = new TICKET_COLLECTION({
      influencerId: influencerId,
      opportunityId: opportunityId,
      description: description,
    });
    newTicket
      .save()
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "New ticket created successfully!",
          data: result,
        };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while create new ticket!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: ticket | Method: _createTicket | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while create new ticket!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get ticket by id
*/
async function _getTicketById(req, res) {
  try {
    const id = req.params.id;
    const existTicket = await TICKET_COLLECTION.findById(id);
    if (!existTicket) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Ticket does not exists!",
        error: "Ticket does not exists!",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = { message: "Ticket found successfully!", data: existTicket };
    return res.send(json);
  } catch (e) {
    console.error("Controller: ticket | Method: _getTicketById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get ticket!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all tickets
*/
async function _getTickets(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let query={};
    if (!token) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Authorization token is required!" };
      return res.send(json);
    }
    const decodedToken = jwt.verify(token, process.env.superSecret);
    const userId = decodedToken.id; 
    if(decodedToken.roleId.name == 'Influencer'){
      query = { influencerId: userId };
    }
    else{
      query = {};
    }

    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;
    var totalRecords = await TICKET_COLLECTION.countDocuments(query);
    var result = await TICKET_COLLECTION.find(query).populate({
        path: "opportunityId",  
        model: "Opportunity",    
        select: ["title", "description", "type", "location", "imageUrl", "brand", "endDate", "status"],  
    })
    .populate({
      path: "influencerId", 
      model: "User",
      select: ["firstName", "lastName"],
    })
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit);
    if (!result) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Tickets not found!", error: "Tickets not found!" };
      return res.send(json);
    }
    
    const formattedResult = result.map(ticket => {
      return {
        ...ticket.toObject(), 
        opportunity: ticket.opportunityId, 
        opportunityId: undefined, 
        influencerData: {
          firstName: ticket.influencerId.firstName,
          lastName: ticket.influencerId.lastName,
        }, // Add influencer data in the response
      };
    });

    json.status = CONSTANT.SUCCESS;
    json.result = {
        message: "Tickets found successfully!",
        data: formattedResult, // Use formatted result
        totalRecords: totalRecords,
      };
    return res.send(json);
  } catch (e) {
    console.error("Controller: ticket | Method: _getTickets | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get tickets!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update ticket by id
*/
async function _updateTicketById(req, res) {
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
    const id = req.params.id;
    const { influencerId, opportunityId, description, couponCode } = req.body;
    
    const existTicket = await TICKET_COLLECTION.findById(id);
    if (!existTicket) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Ticket does not exists!",
        error: "Ticket does not exists!",
      };
      return res.send(json);
    }
    existTicket["influencerId"] = influencerId;
    existTicket["opportunityId"] = opportunityId;
    existTicket["description"] = description;
    existTicket["couponCode"] = !COMMON.isUndefinedOrNull(couponCode) ? couponCode : "";
    TICKET_COLLECTION.findByIdAndUpdate(id, existTicket, { new: true })
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Ticket uploaded successfully!",
          data: result,
        };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while update ticket!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: ticket | Method: _updateTicketById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update ticket!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Remove ticket by id
*/
async function _removeTicketById(req, res) {
  try {
    const id = req.params.id;
    const existTicket = await TICKET_COLLECTION.findById(id);
    if (!existTicket) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Ticket does not exists!",
        error: "Ticket does not exists!",
      };
      return res.send(json);
    }
    TICKET_COLLECTION.findByIdAndDelete(id)
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = { message: "Ticket deleted successfully!", data: {} };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while delete ticket!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: ticket | Method: _removeTicketById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while remove ticket!", error: e };
    return res.send(json);
  }
}
