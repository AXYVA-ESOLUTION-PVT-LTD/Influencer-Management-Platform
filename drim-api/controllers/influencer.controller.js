const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const ROLE_COLLECTION = require("../module/role.module");
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

    const { firstName, lastName, email, roleName } = req.body;

    const isExisting = await USER_COLLECTION.findOne({ email });
    if (isExisting) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "User already exists",
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
      password: encPassword,
      roleId: role._id,
    });
    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create influencer",
      };
      return res.send(json);
    }

    let mailOptions = {
      from: '"DRIM" <drim@drim.com>',
      to: email,
      subject: "Password for Influencer login",
      text: `Your email is ${email} and password is ${password}`,
      html: `<b>Your email is ${email} and password is ${password}</b>`,
    };

    await sendEmail(mailOptions);
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
    console.error(
      "Controller: influencer | Method: _addInfluencer | Error: ",
      e
    );
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

    const { roleName } = req.body;

    const role = await ROLE_COLLECTION.findOne({ name: roleName });

    if (!role) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Role of this type doesn't exist",
      };
      return res.send(json);
    }

    const influencers = await USER_COLLECTION.find(
      { roleId: role._id },
      { password: 0, roleId: 0 }
    ).lean();
    if (influencers.length === 0) {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "No influencer found",
      };
      return res.send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Influencer fetched successfully",
      data: {
        influencers,
        totalInfluencer: influencers.length,
      },
    };
    return res.send(json);
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
