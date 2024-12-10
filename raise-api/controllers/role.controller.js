const { validationResult } = require("express-validator");
const ROLE_COLLECTION = require("../module/role.module");
const CONSTANT = require("../config/constant.js");
var json = {};

exports.addRole = _addRole;
exports.getRoleById = _getRoleById;
exports.getRoles = _getRoles;
exports.updateRoleById = _updateRoleById;
exports.deleteRoleById = _deleteRoleById;

/*
TYPE: Post
TODO: Add new role
*/
async function _addRole(req, res) {
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
    const { name } = req.body;
    const existRole = await ROLE_COLLECTION.findOne({
      name: name,
      isDeleted: false,
    });
    if (existRole) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Role already exists with this name!",
        error: "Role already exists with this name!",
      };
      return res.send(json);
    }

    const newRole = new ROLE_COLLECTION({
      name: name,
    });
    newRole
      .save()
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "New role added successfully!",
          data: result,
        };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while add new role!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: role | Method: _addRole | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while add new role!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get role by id
*/
async function _getRoleById(req, res) {
  try {
    const id = req.params.id;
    const query = { _id: id, isDeleted: false };
    const existRole = await ROLE_COLLECTION.findOne(query);
    if (!existRole) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Role does not exists!",
        error: "Role does not exists!",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = { message: "Role found successfully!", data: existRole };
    return res.send(json);
  } catch (e) {
    console.error("Controller: role | Method: _getRoleById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get role!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all roles
*/
async function _getRoles(req, res) {
  try {
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;
    const query = { isDeleted: false };
    if (req.body.search && req.body.search.name) {
      var nameQuery = {
        name: {
          $regex: new RegExp("^" + search.name.trim().toLowerCase(), "i"),
        },
      };
      query = Object.assign({}, query, nameQuery);
    }
    var totalRecords = await ROLE_COLLECTION.countDocuments(query);
    var result = await ROLE_COLLECTION.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit);
    if (!result) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "Roles not found!", error: "Roles not found!" };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Role found successfully!",
      data: result,
      totalRecords: totalRecords,
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: role | Method: _getRoles | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get users!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update role by id
*/
async function _updateRoleById(req, res) {
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
    const { name } = req.body;
    const query = { _id: id, isDeleted: false };
    const existRole = await ROLE_COLLECTION.findOne(query);
    if (!existRole) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Role does not exists!",
        error: "Role does not exists!",
      };
      return res.send(json);
    }
    existRole["name"] = name;
    ROLE_COLLECTION.findByIdAndUpdate(id, existRole, { new: true })
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Role uploaded successfully!",
          data: result,
        };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while update role!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: role | Method: _getRoleById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update role!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Remove role by id
*/
async function _deleteRoleById(req, res) {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const query = { _id: id, isDeleted: false };
    const existRole = await ROLE_COLLECTION.findOne(query);
    if (!existRole) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Role does not exists!",
        error: "Role does not exists!",
      };
      return res.send(json);
    }
    ROLE_COLLECTION.findByIdAndUpdate(id, { isDeleted: true })
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = { message: "Role deleted successfully!", data: {} };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while delete role!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: role | Method: _deleteRoleById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete role!", error: e };
    return res.send(json);
  }
}
