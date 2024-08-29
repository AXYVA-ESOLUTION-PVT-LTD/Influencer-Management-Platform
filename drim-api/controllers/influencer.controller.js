const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const {
  generatePassword,
  sendEmail,
  encryptPassword,
} = require("../config/common");

const json = {};

exports.addInfluencer = _addInfluencer;

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

    const { firstName, lastName, email } = req.body;

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

    const user = await USER_COLLECTION.create({
      firstName,
      lastName,
      email,
      password: encPassword,
      roleId: "66c56998772fda91c1889b47",
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
