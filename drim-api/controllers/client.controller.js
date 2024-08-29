const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const USER_COLLECTION = require("../module/user.module");
const {
  generatePassword,
  sendEmail,
  encryptPassword,
} = require("../config/common");

const json = {};

exports.addClient = _addClient;

/*
TYPE: Post
TODO: Add new Influencer
*/
async function _addClient(req, res) {
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
    console.log({ isExisting });
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
      roleId: "66c6c3f8380499ba2b85f317",
    });
    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = {
        error: "Fail to create client",
      };
      return res.send(json);
    }

    let mailOptions = {
      from: '"DRIM" <drim@drim.com>',
      to: email,
      subject: "Password for Client login",
      text: `Your email is ${email} and password is ${password}`,
      html: `<b>Your email is ${email} and password is ${password}</b>`,
    };

    await sendEmail(mailOptions);
    const { password: userPassword, ...sanitizeUser } = user.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Client created successfully",
      data: {
        influencer: sanitizeUser,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: client | Method: _addClient | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while adding new Client",
      error: e,
    };
    return res.send(json);
  }
}
