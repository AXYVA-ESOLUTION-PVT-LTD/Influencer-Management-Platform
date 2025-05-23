const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
const TICKET_NOTIFICATION_COLLECTION = require("../module/ticketnotification.module.js");
const USER_COLLECTION = require("../module/user.module.js");
const moment = require("moment");
const json = {};
const ROLES = require("../config/role");

exports.createTicketNotification = _createTicketNotification;
exports.getTicketNotifications = _getTicketNotifications;
exports.updateTicketNotification = _updateTicketNotification;
exports.deleteTicketNotification = _deleteTicketNotification;
exports.getTicketEngagementStatistics = _getTicketEngagementStatistics;

/*
TYPE: Post
TODO: Create TicketNotification
*/
async function _createTicketNotification(req, res) {
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

    const { title, description , ticketId } = req.body;
  
    const user = req.user;
    const notification = await TICKET_NOTIFICATION_COLLECTION.create({
      title,
      description,
      from: user._id,
      ticketId : ticketId,
    });

    await notification.populate({
      path: "from",
      model: "User",
      select: ["email", "firstName"],
    });

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Create TicketNotification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "TicketNotification created Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _createTicketNotification | Error: ",
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
TODO: Get TicketNotifications
*/
async function _getTicketNotifications(req, res) {
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
    const { title, description, status, sortBy, sortOrder, name ,email} =
      req.body;

    if (title) {
      query.title = { $regex: `${title}`, $options: "i" };
    }
    if (!COMMON.isUndefinedOrNull(name)) {
      var oppQuery = { firstName: { $regex: `^${name}`, $options: "i" } };
      var userData = await USER_COLLECTION.find(oppQuery, {
        _id: 1,
      });
      var userIds = userData.map((a) => a._id);
      var opportunityIdsQuery = { from: { $in: userIds } };
      query = Object.assign({}, query, opportunityIdsQuery);
    }
    if (!COMMON.isUndefinedOrNull(email)) {
      var oppQuery = { email: { $regex: `^${email}`, $options: "i" } };
      var userData = await USER_COLLECTION.find(oppQuery, {
        _id: 1,
      });
      var userIds = userData.map((a) => a._id);
      var opportunityIdsQuery = { from: { $in: userIds } };
      query = Object.assign({}, query, opportunityIdsQuery);
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

    const notifications = await TICKET_NOTIFICATION_COLLECTION.find(query)
      .collation({
        locale: "en",
        caseLevel: true,
      })
      .populate({ path: "from", model: "User", select: ["email", "firstName"] })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const totalTicketNotifications = await TICKET_NOTIFICATION_COLLECTION.countDocuments(
      query
    );

    if (!notifications) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Get TicketNotification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "TicketNotification fetched Successfully",
      data: {
        notifications,
        totalTicketNotifications,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _getTicketNotifications | Error: ",
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
TODO: Get TicketNotifications
*/
async function _updateTicketNotification(req, res) {
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

    const notification = await TICKET_NOTIFICATION_COLLECTION.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    ) .populate({
      path: "from",
      model: "User",
      select: ["email", "firstName"],
    });

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Update TicketNotification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "TicketNotification updated Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _updateTicketNotification | Error: ",
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
TODO: Delete TicketNotification
*/
async function _deleteTicketNotification(req, res) {
  try {
    const { id } = req.params;

    const notification = await TICKET_NOTIFICATION_COLLECTION.findOneAndDelete({
      _id: id,
    });

    if (!notification) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to Delete TicketNotification",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "TicketNotification deleted Successfully",
      data: {
        notification,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: notification | Method: _deleteTicketNotification | Error: ",
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

async function _getTicketEngagementStatistics(req, res) {
  const userId = req.decoded.id;
  const currentMonth = moment().format('M'); // Get the current month
  const startDate = moment().startOf('year'); // Start of the year
  const endDate = moment().endOf('day'); // End of the current day

  let query = {
    $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }],
  };
  
  const roleCode = "1425"; // for brand role
  let role = req.decoded.roleId.name;

  if (role === ROLES[roleCode]) {
    query.from = userId;
  }

  try {
    const approvedCounts = Array(+currentMonth).fill(0); // Array for approved counts
    const declinedCounts = Array(+currentMonth).fill(0); // Array for declined counts
    const onHoldCounts = Array(+currentMonth).fill(0); // Array for on-hold counts

    // Fetch ticket notifications
    const ticketNotifications = await TICKET_NOTIFICATION_COLLECTION.find(query, {
      _id: 1,
      status: 1,
      createdAt: 1,
    });

    // Check if any data is found
    if (ticketNotifications && ticketNotifications.length > 0) {
      // Process the data
      ticketNotifications.forEach((item) => {
        const month = new Date(item.createdAt).getMonth(); // Get month (0-11)
        if (item.status === "Approved") {
          approvedCounts[month]++;
        } else if (item.status === "Declined") {
          declinedCounts[month]++;
        } else if (item.status === "On Hold") {
          onHoldCounts[month]++;
        }
      });

      // Return the response with processed data
      return res.send({
        status: CONSTANT.SUCCESS,
        result: {
          message: "Ticket engagement statistics fetched successfully",
          data: {
            approvedCounts,
            declinedCounts,
            onHoldCounts,
          },
        },
      });
    } else {
      // Return response with blank arrays when no data is found
      return res.send({
        status: CONSTANT.SUCCESS,
        result: {
          message: "No ticket engagement statistics found",
          data: {
            approvedCounts,
            declinedCounts,
            onHoldCounts,
          },
        },
      });
    }
  } catch (error) {
    // Handle errors
    return res.send({
      status: CONSTANT.FAIL,
      result: {
        message: "Failed to fetch ticket engagement statistics",
        error: error.message,
      },
    });
  }
}
