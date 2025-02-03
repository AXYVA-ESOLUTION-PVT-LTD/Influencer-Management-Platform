const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const ROLE_COLLECTION = require("../module/role.module");
const WALLET_COLLECTION = require("../module/wallet.module");
const {
  generatePassword,
  sendEmail,
  encryptPassword,
} = require("../config/common");

const json = {};

exports.addInfluencer = _addInfluencer;
exports.getInfluencers = _getInfluencers;
exports.updateInfluencer = _updateInfluencerById;

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
      balance: 0
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
