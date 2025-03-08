const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const USER_DATA_COLLECTION = require("../module/userData.module");
const MONTHLY_PERFORMANCE_COLLECTION = require("../module/monthlyPerformance.module");
const ROLE_COLLECTION = require("../module/role.module");
const WALLET_COLLECTION = require("../module/wallet.module");
const PUBLICATION_COLLECTION = require("../module/publication.module");
const USER_PROFILE_COLLECTION = require("../module/userProfile.module");
const USER_POST_COLLECTION = require("../module/userPost.module");
const AUDIENCE_INSIGHT = require("../module/audienceInsight.module");
const TICKET_NOTIFICATION_COLLECTION = require("../module/ticketnotification.module.js");
const {
  generatePassword,
  sendEmail,
  encryptPassword,
} = require("../config/common");
const moment = require("moment");

const json = {};

exports.addInfluencer = _addInfluencer;
exports.getInfluencers = _getInfluencers;
exports.updateInfluencer = _updateInfluencerById;

exports.getUserProfileData = _getUserProfileData;
exports.getUserBasicData = _getUserBasicData;
exports.getUserPostStatisticsData = _getUserPostStatisticsData;
exports.getUserMonthlyStatisticsData = _getUserMonthlyStatisticsData;
exports.getUserDemographicStatistics = _getUserDemographicStatistics;
exports.getUserPublicationData = _getUserPublicationData;
exports.getUserMediaData = _getUserMediaData;
/*
TYPE: Post
TODO: Add new Influencer
*/
async function _addInfluencer(req, res) {
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
      roleName,
      country,
      phoneNumber,
      city,
      platform,
      username,
    } = req.body;

    const isEmailExisting = await USER_COLLECTION.findOne({ email });
    const isPhoneNumberExisting = await USER_COLLECTION.findOne({
      phoneNumber,
    });
    const isUsernameExisting = await USER_COLLECTION.findOne({ username });

    if (isEmailExisting || isPhoneNumberExisting || isUsernameExisting) {
      let errors = [];

      if (isEmailExisting) {
        errors.push("This email is already in use. Try another.");
      }

      if (isPhoneNumberExisting) {
        errors.push(
          "This phone number is taken. Please choose a different one."
        );
      }

      if (isUsernameExisting) {
        errors.push("This username is already taken. Pick another.");
      }

      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create Influencer",
        details: errors,
      };
      return res.send(json);
    }

    const password = generatePassword();
    const encPassword = await encryptPassword(password);

    const role = await ROLE_COLLECTION.findOne({ name: roleName });

    if (!role) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Role of this type doesn't exist",
      };
      return res.send(json);
    }

    const user = await USER_COLLECTION.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      city,
      password: encPassword,
      roleId: role._id,
      platform,
      username,
    });

    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create influencer",
      };
      return res.send(json);
    }

    const wallet = new WALLET_COLLECTION({
      influencerId: user._id,
      balance: 0,
    });

    await wallet.save();

    let mailOptions = {
      from: '"RAISE" <raise@raise.com>',
      to: email,
      subject: "Password for Influencer login",
      text: `Your email is ${email} and password is ${password}`,
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Influencer Login Credentials</title>
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
          <p>Dear Influencer,</p>
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
          <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@raise.com">support@raise.com</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 RAISE. All rights reserved.</p>
          <p>
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>`,
    };

    const sendMailData = await sendEmail(mailOptions);
    console.log("sendMailData : ------------------->", sendMailData);
    const { password: userPassword, ...sanitizeUser } = user.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Influencer created successfully",
      data: {
        influencer: sanitizeUser,
      },
    };
    return res.send(json);
  } catch (e) {
    console.log("Controller: influencer | Method: _addInfluencer | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while adding new Influencer",
      error: e,
    };
    return res.send(json);
  }
}
/*
TYPE: Post
TODO: Get All Influencer
*/
async function _getInfluencers(req, res) {
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
      roleName,
      firstName,
      lastName,
      email,
      status,
      sortBy,
      sortOrder,
      allrecord,
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
      const influencers = await USER_COLLECTION.find(query, {
        password: 0,
        roleId: 0,
      })
        .collation({ locale: "en", caseLevel: true })
        .lean();

      if (influencers.length === 0) {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "No influencer found",
          data: {
            influencers,
          },
        };
        return res.send(json);
      }

      const totalInfluencers = await USER_COLLECTION.countDocuments(query);
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Influencers fetched successfully",
        data: {
          influencers,
          totalInfluencers,
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
      if (status !== undefined && status !== "") {
        query.status = status === "true" || status === true;
      }

      if (sortBy) {
        sort[sortBy] = sortOrder === 1 ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      const influencers = await USER_COLLECTION.find(query, {
        password: 0,
        roleId: 0,
      })
        .collation({ locale: "en", caseLevel: true })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      if (influencers.length === 0) {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "No influencer found",
          data: {
            influencers,
          },
        };
        return res.send(json);
      }

      const totalInfluencers = await USER_COLLECTION.countDocuments(query);

      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Influencers fetched successfully",
        data: {
          influencers,
          totalInfluencers,
        },
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: influencer | Method: _getInfluencers | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while getting Influencers",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Update
TODO: Update Influencer
*/
async function _updateInfluencerById(req, res) {
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

    const influencer = await USER_COLLECTION.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );
    if (!influencer) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to update Influencer",
      };
      return res.send(json);
    }
    const { password, ...sanitizeInfluencer } = influencer.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Influencer Updated successfully",
      data: {
        influencer: sanitizeInfluencer,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: influencer | Method: _updateInfluencers | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while updating Influencers",
      error: e,
    };
    return res.send(json);
  }
}

// 1. Get Influencer Profile information
async function _getUserProfileData(req, res) {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     // Find user data from UserProfile collection
     const userProfileData = await USER_PROFILE_COLLECTION.findOne({
      userId: user._id,
    });

    if (!userProfileData) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    const responseData = {
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      ...userProfileData.toObject(), // Merge userProfileData
    };

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "User profile data fetched successfully",
        data: responseData,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Internal Server Error",
      error: error.message,
    };
    return res.status(500).json(json);
  }
}

// 2. Get Influencer Basic Data
async function _getUserBasicData(req, res) {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find user data from UserData collection
    const userData = await USER_DATA_COLLECTION.findOne({ userId: user._id });

    if (!userData) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    // Extract platform-specific data
    const platforms = {
      facebook: userData.facebook,
      instagram: userData.instagram,
      youtube: userData.youtube,
      tiktok: userData.tiktok,
    };

    // Function to check if an object has only empty or null values
    const isObjectEmpty = (obj) =>
      !obj ||
      Object.values(obj).every(
        (value) => value === null || value === undefined
      );

    // Remove empty platform objects
    const filteredPlatforms = Object.fromEntries(
      Object.entries(platforms).filter(([_, value]) => !isObjectEmpty(value))
    );

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "User data fetched successfully",
      data: {
        platforms: filteredPlatforms,
      },
    };

    return res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching user data:", error);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Internal Server Error",
      error: error.message,
    };
    return res.status(500).json(json);
  }
}

// 3. Get Influencer Post Statistics Data
async function _getUserPostStatisticsData(req, res) {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = moment().startOf("year").toDate(); // Start of the year
    const endDate = moment().endOf("day").toDate(); // End of the current day

    // Define query to fetch data within the year and for the specific user
    const query = {
      createdAt: { $gte: startDate, $lte: endDate },
      from: user._id,
    };

    // Initialize arrays with zero values for **all 12 months**
    const approvedCounts = Array(12).fill(0);
    const declinedCounts = Array(12).fill(0);
    const onHoldCounts = Array(12).fill(0);

    // Fetch relevant ticket notifications
    const ticketNotifications = await TICKET_NOTIFICATION_COLLECTION.find(
      query,
      {
        status: 1,
        createdAt: 1,
      }
    );

    // Process notifications and count by month
    ticketNotifications.forEach(({ status, createdAt }) => {
      const monthIndex = new Date(createdAt).getMonth(); // Get month index (0-11)
      if (status === "Approved") approvedCounts[monthIndex]++;
      else if (status === "Declined") declinedCounts[monthIndex]++;
      else if (status === "On Hold") onHoldCounts[monthIndex]++;
    });

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: ticketNotifications.length
          ? "Ticket engagement statistics fetched successfully"
          : "No ticket engagement statistics found",
        data: {
          approvedCounts,
          declinedCounts,
          onHoldCounts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching ticket engagement statistics:", error);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Failed to fetch ticket engagement statistics",
        error: error.message,
      },
    });
  }
}

// 4. Get Influencer Monthly Data
async function _getUserMonthlyStatisticsData(req, res) {
  try {
    const { id } = req.params;

    // Validate if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        message: "User not found",
      });
    }

    // Fetch Monthly Performance Data
    const monthlyPerformance = await MONTHLY_PERFORMANCE_COLLECTION.findOne({
      userId: user._id,
    });

    if (!monthlyPerformance) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        message: "No monthly performance data found for this user.",
      });
    }

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "Monthly analytics data fetched successfully.",
        data: {
          postCountArray: monthlyPerformance.monthlyPostCount || [],
          engagementRateArray: Array.isArray(
            monthlyPerformance.monthlyEngagementRate
          )
            ? monthlyPerformance.monthlyEngagementRate.map((val) =>
                val ? parseFloat(val.toFixed(2)) : 0
              )
            : [],
          commentCountArray: monthlyPerformance.monthlyCommentCount || [],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user monthly statistics:", error);

    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Internal Server Error",
        error: error.message,
      },
    });
  }
}

// 5. get Instagram Demographic Information
async function _getUserDemographicStatistics(req, res) {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch demographic data
    const demographicData = await AUDIENCE_INSIGHT.findOne({
      userId: user._id,
    });

    if (!demographicData) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        message: "No demographic insights found for this user.",
      });
    }

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "demographic insights retrieved successfully.",
        data: demographicData,
      },
    });
  } catch (error) {
    console.error("Error fetching user demographic statistics:", error);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Internal server error",
        error: error.message,
      },
    });
  }
}

// 6. Get User Publication Data
async function _getUserPublicationData(req, res) {
  try {
    const { id } = req.params;
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;

    const skip = limit * pageCount;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;

    var query = { isDeleted: false, influencerId: userId };

    var totalRecords = await PUBLICATION_COLLECTION.countDocuments(query);
    var result = await PUBLICATION_COLLECTION.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "influencerId",
        model: "User",
        select: ["username", "platform"],
      })
      .populate({
        path: "opportunityId",
        model: "Opportunity",
        select: ["title"],
      });
    if (!result) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publications not found!",
        error: "Publications not found!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Publications found successfully!",
        data: result,
        totalRecords: totalRecords,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _getPublications | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while get publications!",
      error: e,
    };
    return res.send(json);
  }
}

// 7. Get Video Data
async function _getUserMediaData(req, res) {
  try {
    const { id } = req.params;

    // Check if the user exists
    const user = await USER_COLLECTION.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all media posts for the user
    const videoPosts = await USER_POST_COLLECTION.find({ userId: user._id });

    if (!videoPosts.length) {
      return res.status(404).json({
        status: CONSTANT.FAIL,
        message: "No media posts found for this user.",
      });
    }

    return res.status(200).json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "User media posts retrieved successfully.",
        data: videoPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching user media posts:", error);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "An error occurred while retrieving media posts.",
        error: error.message,
      },
    });
  }
}
