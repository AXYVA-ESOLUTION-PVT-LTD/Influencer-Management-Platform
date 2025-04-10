const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const ROLE_COLLECTION = require("../module/role.module");
const OPPORTUNITY_COLLECTION = require("../module/opportunity.module");
const TICKET_COLLECTION = require("../module/ticket.module");
const TICKET_NOTIFICATION_COLLECTION = require("../module/ticketnotification.module.js");
const PUBLICATION_COLLECTION = require("../module/publication.module");
const {
  generatePassword,
  sendEmail,
  encryptPassword,
} = require("../config/common");
const ROLES = require("../config/role");
require("dotenv").config();
const json = {};

exports.addBrand = _addBrand;
exports.getBrand = _getBrand;
exports.updateBrandById = _updateBrandById;
exports.getOpportunityStatistics = _getOpportunityStatistics;
exports.getInfluencersStatistics = _getInfluencersStatistics;
exports.getBrandDataStatistics = _getBrandDataStatistics;
exports.getBrandInfluencerStatistics = _getBrandInfluencerStatistics;
exports.getBrandInfluencerStatisticsByCountry =
  _getBrandInfluencerStatisticsByCountry;
exports.getAllPublicationsByBrand = _getAllPublicationsByBrand;

/*
TYPE: Post
TODO: Get All Brands
*/
async function _getBrand(req, res) {
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

    let query = {};
    let sort = {};

    const {
      allrecord,
      roleName,
      firstName,
      lastName,
      email,
      companyName,
      status,
      sortBy,
      sortOrder,
    } = req.body;

    const role = await ROLE_COLLECTION.findOne({ name: roleName });

    if (!role) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Role of this type doesn't exist",
      };
      return res.send(json);
    }

    query.roleId = role._id;

    if (allrecord) {
      query.roleId = role._id;
      const brands = await USER_COLLECTION.find(query, {
        password: 0,
        roleId: 0,
      })
        .collation({ locale: "en", caseLevel: true })
        .lean();

      if (brands.length === 0) {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "No Brands found",
          data: {
            brands,
          },
        };
        return res.send(json);
      }

      const totalBrands = await USER_COLLECTION.countDocuments(query);
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Brands fetched successfully",
        data: {
          brands,
          totalBrands,
        },
      };
      return res.send(json);
    } else {
      if (firstName) {
        query.firstName = { $regex: `^${firstName}`, $options: "i" };
      }
      if (lastName) {
        query.lastName = { $regex: `^${lastName}`, $options: "i" };
      }
      if (email) {
        query.email = { $regex: `^${email}`, $options: "i" };
      }
      if (companyName) {
        query.companyName = { $regex: `^${companyName}`, $options: "i" };
      }
      if (status !== undefined && status !== "") {
        query.status = status === "true" || status === true;
      }

      if (sortBy) {
        sort[sortBy] = sortOrder === 1 ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }
      query.roleId = role._id;

      const brands = await USER_COLLECTION.find(query, {
        password: 0,
        roleId: 0,
      })
        .collation({ locale: "en", caseLevel: true })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      if (brands.length === 0) {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "No Brands found",
          data: {
            brands,
          },
        };
        return res.send(json);
      }

      const totalBrands = await USER_COLLECTION.countDocuments(query);

      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Brands fetched successfully",
        data: {
          brands,
          totalBrands,
        },
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: brand | Method: _getBrand | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while getting Brands",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Add new Brand
*/
async function _addBrand(req, res) {
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

    const {
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      city,
      country,
      status,
    } = req.body;

    const isEmailExisting = await USER_COLLECTION.findOne({ email });
    const isPhoneNumberExisting = await USER_COLLECTION.findOne({
      phoneNumber,
    });
    const isCompanyExisting = await USER_COLLECTION.findOne({ companyName });

    if (isEmailExisting || isPhoneNumberExisting || isCompanyExisting) {
      let errors = [];

      if (isEmailExisting) {
        errors.push("This email is already in use. Try another.");
      }

      if (isPhoneNumberExisting) {
        errors.push(
          "This phone number is taken. Please choose a different one."
        );
      }

      if (isCompanyExisting) {
        errors.push("This company name is already taken. Pick another.");
      }

      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create Brand",
        details: errors,
      };
      return res.send(json);
    }

    const password = generatePassword();
    const encPassword = await encryptPassword(password);

    const roleCode = "1800"; // for brand role
    const roleName = ROLES[roleCode];
    const role = await ROLE_COLLECTION.findOne({ name: roleName });

    const brand = await USER_COLLECTION.create({
      firstName,
      lastName,
      email,
      companyName,
      phoneNumber,
      city,
      country,
      password: encPassword,
      roleId: role._id,
      status,
    });

    if (!brand) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create Brand",
      };
      return res.send(json);
    }

    let mailOptions = {
      from: "info@brandraise.io",
      to: email,
      subject: "Password for Brand login",
      text: `Your email is ${email} and password is ${password}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Brand Login Credentials</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 20px 20px;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: #8832E6;
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      margin: 10px 0;
    }
    .credentials {
      background: #f4f4f4;
      padding: 15px;
      margin: 20px 0;
      border: 1px dashed #ccc;
      border-radius: 5px;
    }
    .credentials p {
      margin: 5px 0;
    }
    .button-container {
      text-align: center;
      margin: 20px 0;
    }
    .button {
      background: #8832E6;
      color: #fff !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      display: inline-block;
    }
    .button:hover {
      background: #6d26b8;
    }
    .footer {
      background: #333;
      color: #fff;
      padding: 15px;
      text-align: center;
      font-size: 12px;
    }
    .footer a {
      color: #8832E6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to RAISE</h1>
    </div>
    <div class="content">
      <h2>Your Login Credentials</h2>
      <p>Dear User,</p>
      <p>Please find your login credentials below. Use these details to access your account.</p>
      <div class="credentials">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p><strong>Note:</strong> For your security, please do the following immediately upon logging in:</p>
      <ul>
        <li>Change your password to something secure and memorable.</li>
        <li>Do not share your login details with anyone.</li>
      </ul>
      <div class="button-container">
        <a class="button" href="https://dash.brandraise.io/" target="_blank">Continue to Login</a>
      </div>
      <p>If you have any questions, feel free to contact our support team at <a href="mailto:info@brandraise.io">info@brandraise.io</a>.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 RAISE. All rights reserved.</p>
      <p>
        <a href="https://brandraise.io/privacy-policy/">Privacy Policy</a> | <a href="https://brandraise.io/terms-conditions/">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
`,
    };

    await sendEmail(mailOptions);

    const { password: brandPassword, ...sanitizeBrand } = brand.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Brand created successfully",
      data: {
        brand: sanitizeBrand,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: brand | Method: _addBrand | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while adding new Brand",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Update
TODO: Update Brand
*/
async function _updateBrandById(req, res) {
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

    const { status, roleName } = req.body;
    const { id } = req.params;

    const role = await ROLE_COLLECTION.findOne({ name: roleName });

    if (!role) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Role of this type doesn't exist",
      };
      return res.send(json);
    }

    const brand = await USER_COLLECTION.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );

    if (!brand) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to update Brand",
      };
      return res.send(json);
    }

    const { password, ...sanitizeBrand } = brand.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Brand Updated successfully",
      data: {
        brand: sanitizeBrand,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: brand | Method: _updateBrandById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while updating Brand",
      error: e,
    };
    return res.send(json);
  }
}

// Get opportunity Statistics
async function _getOpportunityStatistics(req, res) {
  try {
    const { id } = req.decoded;

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);

    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "User not found" };
      return res.status(404).json(json);
    }

    const companyName = user.companyName;
    if (!companyName) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Company name not found for the user" };
      return res.status(400).json(json);
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Fetch all opportunities for this company in the current year
    const opportunities = await OPPORTUNITY_COLLECTION.find({
      brand: companyName,
      endDate: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`), // Start of the year
        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`), // End of the year
      },
    }).lean();

    let monthlyOpportunities = new Array(12).fill(0);

    opportunities.forEach((opp) => {
      const monthIndex = new Date(opp.endDate).getMonth();
      monthlyOpportunities[monthIndex] += 1;
    });

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Opportunity statistics fetched successfully",
      data: {
        monthlyOpportunities,
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching opportunity statistics:", error);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Internal Server Error",
      error: error.message,
    };
    return res.status(500).json(json);
  }
}

// Get Influencers Statistics
async function _getInfluencersStatistics(req, res) {
  let json = { status: "", result: {} };

  try {
    const { id } = req.decoded;

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "User not found" };
      return res.status(404).json(json);
    }

    const companyName = user.companyName;
    if (!companyName) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Company name not found for the user" };
      return res.status(400).json(json);
    }

    // Find all opportunities for this brand
    const opportunities = await OPPORTUNITY_COLLECTION.find({
      brand: companyName,
    }).lean();

    if (!opportunities.length) {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "No opportunities found for this brand",
        data: {
          companyName,
          totalTickets: 0,
          opportunities: [],
          tickets: [],
          approvedCounts: new Array(12).fill(0),
          declinedCounts: new Array(12).fill(0),
          onHoldCounts: new Array(12).fill(0),
        },
      };
      return res.status(200).json(json);
    }

    // Get opportunity IDs
    const opportunityIds = opportunities.map((opp) => opp._id);

    // Fetch tickets with their notification status using aggregation
    const tickets = await TICKET_COLLECTION.aggregate([
      { $match: { opportunityId: { $in: opportunityIds } } },
      {
        $lookup: {
          from: "ticketnotifications",
          localField: "_id",
          foreignField: "ticketId",
          as: "notifications",
        },
      },
      {
        $addFields: {
          status: {
            $ifNull: [
              { $arrayElemAt: ["$notifications.status", 0] },
              "On Hold",
            ],
          },
        },
      },
      {
        $project: {
          notifications: 0, // Exclude notifications array
        },
      },
    ]);

    // Calculate total tickets
    const totalTickets = tickets.length;

    // Function to count ticket statuses per month
    function getTicketStatusCounts(tickets) {
      let approvedCounts = new Array(12).fill(0);
      let declinedCounts = new Array(12).fill(0);
      let onHoldCounts = new Array(12).fill(0);

      tickets.forEach((ticket) => {
        const ticketDate = new Date(ticket.createdAt);
        const monthIndex = ticketDate.getMonth(); // Get month (0-11)

        if (ticket.status === "Approved") {
          approvedCounts[monthIndex] += 1;
        } else if (ticket.status === "Declined") {
          declinedCounts[monthIndex] += 1;
        } else if (ticket.status === "On Hold") {
          onHoldCounts[monthIndex] += 1;
        }
      });

      return { approvedCounts, declinedCounts, onHoldCounts };
    }

    // Get ticket status counts
    const { approvedCounts, declinedCounts, onHoldCounts } =
      getTicketStatusCounts(tickets);

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Influencer statistics fetched successfully",
      data: {
        // companyName,
        // totalTickets,
        // tickets, // Tickets now include status
        approvedCounts,
        declinedCounts,
        onHoldCounts,
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching influencer statistics:", error);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Internal Server Error",
      error: error.message,
    };
    return res.status(500).json(json);
  }
}

// Basic Card Data
async function _getBrandDataStatistics(req, res) {
  try {
    const { id } = req.decoded;

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const companyName = user.companyName;
    if (!companyName) {
      return res.status(400).json({
        status: "fail",
        message: "Company name not found for the user",
      });
    }

    // Find all opportunities for this brand
    const opportunities = await OPPORTUNITY_COLLECTION.find({
      brand: companyName,
    }).lean();
    const opportunityIds = opportunities.map((opp) => opp._id);

    // Fetch tickets with their notification status using aggregation
    const tickets = await TICKET_COLLECTION.aggregate([
      { $match: { opportunityId: { $in: opportunityIds } } },
      {
        $lookup: {
          from: "ticketnotifications",
          localField: "_id",
          foreignField: "ticketId",
          as: "notifications",
        },
      },
      {
        $addFields: {
          status: {
            $ifNull: [
              { $arrayElemAt: ["$notifications.status", 0] },
              "On Hold",
            ],
          },
        },
      },
      {
        $project: {
          notifications: 0, // Exclude notifications array
        },
      },
    ]);

    // Get unique influencer count
    const uniqueInfluencerIds = new Set(
      tickets.map((ticket) => ticket.influencerId.toString()) // Convert ObjectId to string
    );
    const activeInfluencerCount = uniqueInfluencerIds.size;

    // Count number of opportunities related to this brand
    const opportunityCount = opportunities.length;

    // Count total views across all opportunities
    const totalViews = opportunities.reduce(
      (sum, opp) => sum + (opp.views ? opp.views.length : 0),
      0
    );

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Brand statistics fetched successfully",
      data: {
        activeInfluencerCount,
        totalViews,
        opportunityCount,
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching brand data statistics:", error);

    const json = {};
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Internal Server Error",
      error: error.message,
    };

    return res.status(500).json(json);
  }
}

// Calculate Influencer Platform percentages
async function _getBrandInfluencerStatistics(req, res) {
  try {
    const { id } = req.decoded;

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const companyName = user.companyName;
    if (!companyName) {
      return res.status(400).json({
        status: "fail",
        message: "Company name not found for the user",
      });
    }

    // Find all opportunities for this brand
    const opportunities = await OPPORTUNITY_COLLECTION.find({
      brand: companyName,
    }).lean();
    const opportunityIds = opportunities.map((opp) => opp._id);

    // Fetch tickets with their notification status using aggregation
    const tickets = await TICKET_COLLECTION.aggregate([
      { $match: { opportunityId: { $in: opportunityIds } } },
      {
        $lookup: {
          from: "ticketnotifications",
          localField: "_id",
          foreignField: "ticketId",
          as: "notifications",
        },
      },
      {
        $addFields: {
          status: {
            $ifNull: [
              { $arrayElemAt: ["$notifications.status", 0] },
              "On Hold",
            ],
          },
        },
      },
      {
        $project: {
          notifications: 0, // Exclude notifications array
        },
      },
    ]);
    // Get unique influencer IDs
    const uniqueInfluencerIds = [
      ...new Set(tickets.map((ticket) => ticket.influencerId.toString())),
    ];

    // Fetch influencers and their platforms
    const influencers = await USER_COLLECTION.find(
      { _id: { $in: uniqueInfluencerIds } },
      { platform: 1 } // Fetch only platform field
    ).lean();

    // Initialize platform counts
    const platformCounts = {
      Instagram: 0,
      Facebook: 0,
      YouTube: 0,
      Tiktok: 0,
    };

    // Count influencers per platform
    influencers.forEach((influencer) => {
      const platform = influencer.platform?.trim(); // Ensure platform is a valid string
      if (platform && platformCounts.hasOwnProperty(platform)) {
        platformCounts[platform]++;
      }
    });

    // Calculate percentages
    const totalInfluencers = uniqueInfluencerIds.length;

    const pieChartData = Object.entries(platformCounts).map(
      ([platform, count]) => ({
        name: platform,
        y:
          totalInfluencers > 0
            ? parseFloat(((count / totalInfluencers) * 100).toFixed(2))
            : 0,
      })
    );

    const json = {
      status: CONSTANT.SUCCESS,
      result: {
        message: "Brand influencer statistics fetched successfully",
        data: {
          activeInfluencerCount: totalInfluencers,
          pieChartData, // Platform-wise influencer percentages
        },
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching brand influencer statistics:", error);

    const json = {
      status: CONSTANT.FAIL,
      result: {
        message: "Internal Server Error",
        error: error.message,
      },
    };

    return res.status(500).json(json);
  }
}

// Country-wise influencer percentages
async function _getBrandInfluencerStatisticsByCountry(req, res) {
  try {
    const { id } = req.decoded;

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const companyName = user.companyName;
    if (!companyName) {
      return res.status(400).json({
        status: "fail",
        message: "Company name not found for the user",
      });
    }

    // Find all opportunities for this brand
    const opportunities = await OPPORTUNITY_COLLECTION.find({
      brand: companyName,
    }).lean();
    const opportunityIds = opportunities.map((opp) => opp._id);

    // Fetch tickets with their notification status using aggregation
    const tickets = await TICKET_COLLECTION.aggregate([
      { $match: { opportunityId: { $in: opportunityIds } } },
      {
        $lookup: {
          from: "ticketnotifications",
          localField: "_id",
          foreignField: "ticketId",
          as: "notifications",
        },
      },
      {
        $addFields: {
          status: {
            $ifNull: [
              { $arrayElemAt: ["$notifications.status", 0] },
              "On Hold",
            ],
          },
        },
      },
      {
        $project: {
          notifications: 0, // Exclude notifications array
        },
      },
    ]);

    // Get unique influencer IDs
    const uniqueInfluencerIds = [
      ...new Set(tickets.map((ticket) => ticket.influencerId.toString())),
    ];

    // Fetch influencers and their countries
    const influencers = await USER_COLLECTION.find(
      { _id: { $in: uniqueInfluencerIds } },
      { country: 1 } // Fetch only country field
    ).lean();

    const countryCounts = {}; // Object to store country-wise counts

    // Count influencers per country
    influencers.forEach((influencer) => {
      const country = influencer.country?.trim();
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });

    // Calculate total influencers
    const totalInfluencers = uniqueInfluencerIds.length;

    // Convert country counts to percentage
    const countryChartData = Object.entries(countryCounts).map(
      ([country, count]) => ({
        name: country,
        y:
          totalInfluencers > 0
            ? parseFloat(((count / totalInfluencers) * 100).toFixed(2))
            : 0,
      })
    );

    const json = {
      status: CONSTANT.SUCCESS,
      result: {
        message: "Brand influencer country statistics fetched successfully",
        data: {
          activeInfluencerCount: totalInfluencers,
          countryChartData, // Country-wise influencer percentages
        },
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching brand influencer country statistics:", error);

    const json = {
      status: CONSTANT.FAIL,
      result: {
        message: "Internal Server Error",
        error: error.message,
      },
    };

    return res.status(500).json(json);
  }
}

// Get All Publication Data
async function _getAllPublicationsByBrand(req, res) {
  try {
    const { id } = req.decoded;
    const limit = req.body.limit ? parseInt(req.body.limit) : 10;
    const pageCount = req.body.pageCount ? parseInt(req.body.pageCount) : 0;
    const skip = limit * pageCount;

    const {
      influencer,
      platform,
      status,
      type,
      engagementRate,
      followerCount,
      likeCount,
      commentCount,
      shareCount,
      viewCount,
    } = req.body;

    let query = { isDeleted: false };

    // Find user to get their companyName
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        result: { message: "User not found" },
      });
    }

    const companyName = user.companyName;
    if (!companyName) {
      return res.status(400).json({
        status: CONSTANT.FAIL,
        result: { message: "Company name not found for the user" },
      });
    }

    // Find all opportunities for this brand
    const opportunities = await OPPORTUNITY_COLLECTION.find({ brand: companyName }).lean();
    if (opportunities.length === 0) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        result: { message: "No opportunities found for this brand" },
      });
    }

    const opportunityIds = opportunities.map((opp) => opp._id);
    query.opportunityId = { $in: opportunityIds };

    // Apply Filters for Influencer Search
    if (platform || influencer) {
      let userQuery = {};
      if (platform) userQuery.platform = platform;
      if (influencer) userQuery.username = { $regex: `^${influencer}`, $options: "i" };

      const users = await USER_COLLECTION.find(userQuery, { _id: 1 }).lean();
      if (!users.length) {
        return res.status(200).json({
          status: CONSTANT.SUCCESS,
          result: {
            message: "Publications found successfully!",
            data: [],
            totalPublications: 0,
          },
        });
      }

      query.influencerId = { $in: users.map((user) => user._id) };
    }

    // Apply Additional Filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (engagementRate > 0) query.engagementRate = { $lte: engagementRate };
    if (followerCount > 0) query.followerCount = { $lte: followerCount };
    if (likeCount > 0) query.likeCount = { $lte: likeCount };
    if (commentCount > 0) query.commentCount = { $lte: commentCount };
    if (shareCount > 0) query.shareCount = { $lte: shareCount };
    if (viewCount > 0) query.viewCount = { $lte: viewCount };

    // Count total number of publications
    const totalPublications = await PUBLICATION_COLLECTION.countDocuments(query);

    // Fetch paginated publications
    const publications = await PUBLICATION_COLLECTION.find(query)
      .populate("influencerId", "username platform")
      .populate("opportunityId", "title")
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "Publications fetched successfully",
        totalPublications,
        publications,
      },
    });
  } catch (error) {
    console.error("Error fetching all publications by brand:", error);

    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Internal Server Error",
        error: error.message,
      },
    });
  }
}
