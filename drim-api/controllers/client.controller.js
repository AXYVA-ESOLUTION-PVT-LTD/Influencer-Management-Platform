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

exports.addClient = _addClient;
exports.getClient = _getClient;
exports.updateClientById = _updateClientById;

/*
TYPE: Post
TODO: Get All Influencer
*/
async function _getClient(req, res) {
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

    const clients = await USER_COLLECTION.find(
      { roleId: role._id },
      { password: 0, roleId: 0 }
    ).lean();
    if (clients.length === 0) {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "No clients found",
      };
      return res.send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Clients fetched successfully",
      data: {
        clients,
        Totalclient: clients.length,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: client | Method: _getClient | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while getting Client",
      error: e,
    };
    return res.send(json);
  }
}

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
        client: sanitizeUser,
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

/*
TYPE: Update
TODO: Update Influencer
*/
async function _updateClientById(req, res) {
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

    const client = await USER_COLLECTION.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true, runValidators: true }
    );
    if (!client) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to update Client",
      };
      return res.send(json);
    }
    const { password, ...sanitizeClient } = client.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Client Updated successfully",
      data: {
        client: sanitizeClient,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: client | Method: _updateClient | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while updating Client",
      error: e,
    };
    return res.send(json);
  }
}
