const { validationResult } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ForgotPassword = require("../module/forgotPassword.module.js");
const Role = require("../module/role.module.js");
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, "..", "uploads");
const { OAuth2Client } = require("google-auth-library");
const ROLES = require("../config/role.js");
require("dotenv").config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const json = {};

exports.login = _login;
exports.signUp = _signUp;

exports.updateProfile = _updateProfile;

exports.forgotPassword = _forgotPassword;
exports.OTPVerification = _OTPVerification;
exports.changePassword = _changePassword;

exports.resetPassword = _resetPassword;

exports.getUserById = _getUserById;
exports.getUsers = _getUsers;
exports.updateUserById = _updateUserById;
exports.deleteUserById = _deleteUserById;

/*
TYPE: Post
TODO: Add new user
*/
async function _signUp(req, res) {
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
    const { firstName, lastName, email, password, roleCode } = req.body;
    const existUser = await USER_COLLECTION.findOne({
      email: email,
      isDeleted: false,
    });
    if (existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User already exists with this email!",
        error: "User already exists with this email!",
      };
      return res.send(json);
    }
    const encPassword = await COMMON.encryptPassword(password);
    const roleName = ROLES[roleCode];
    const role = await Role.findOne({ name: roleName });
    
    const user = new USER_COLLECTION({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encPassword,
      roleId: role._id,
    });
    user
      .save()
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = { message: "User added successfully!", data: result };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while add new user!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: user | Method: _signUp | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while add new user!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Log in user by email and password
*/
async function _login(req, res) {
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
    const { email, password, mode, token, roleCode } = req.body;
    const roleName = ROLES[roleCode];
    const role = await Role.findOne({ name: roleName });
    
    if(mode == "google"){
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();

      const existUser = await USER_COLLECTION.findOne({
        email: payload.email,
        isDeleted: false,
      }).populate({
        path: "roleId",
        model: "Role",
        select: ["name"],
      });

      if(existUser) {
        let userObj = {
          id: existUser._id,
          email: existUser.email,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
          roleId: existUser.roleId,
        };
  
        let token = jwt.sign(userObj, process.env.superSecret, {
          expiresIn: 86400,
        });
  
        const {
          password: _,
          createdAt,
          updatedAt,
          ...userWithoutSensitiveInfo
        } = existUser.toObject();
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "User login successfully!",
          data: { token: token, user: userWithoutSensitiveInfo },
        };
        return res.send(json);
      } else {
        const user = new USER_COLLECTION({
          firstName: payload.given_name,
          lastName: payload.family_name,
          email: payload.email,
          password: "",
          roleId: role._id
        });
        user
          .save()
          .then(async (result) => {

            let userObj = {
              id: result._id,
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
              roleId: result.roleId,
            };
      
            let token = jwt.sign(userObj, process.env.superSecret, {
              expiresIn: 86400,
            });
      
            const createdUser = await USER_COLLECTION.findById(result._id).populate({
              path: "roleId",
              model: "Role",
              select: ["name"],
            }); 
            const {
              password: _,
              createdAt,
              updatedAt,
              ...userWithoutSensitiveInfo
            } = createdUser.toObject();
            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "User login successfully!",
              data: { token: token, user: userWithoutSensitiveInfo },
            };
            return res.send(json);
          }).catch((error) => {
            console.log(error);
            
            json.status = CONSTANT.FAIL;
            json.result = {
              message: "An error occurred while add new user!",
              error: error,
            };
            return res.send(json);
          });
      }

    } else {
      const existUser = await USER_COLLECTION.findOne({
        email: email,
        isDeleted: false,
      }).populate({
        path: "roleId",
        model: "Role",
        select: ["name"],
      });
  
      if (!existUser) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "User not found with this email!",
          error: "User not found with this email!",
        };
        return res.send(json);
      }
  
      if (!existUser.status) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "User is being Inactive, Please contact Admin",
          error: "User is being Inactive, Please contact Admin",
        };
        return res.send(json);
      }
  
      const decryptedPassword = await COMMON.decryptPassword(existUser.password);
  
      if (password == decryptedPassword) {
        let userObj = {
          id: existUser._id,
          email: existUser.email,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
          roleId: existUser.roleId,
        };
  
        let token = jwt.sign(userObj, process.env.superSecret, {
          expiresIn: 86400,
        });
  
        existUser.status = true;
        existUser.save();
  
        const {
          password: _,
          createdAt,
          updatedAt,
          ...userWithoutSensitiveInfo
        } = existUser.toObject();
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "User login successfully!",
          data: { token: token, user: userWithoutSensitiveInfo },
        };
        return res.send(json);
      } else {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Invalid email or password!",
          error: "Invalid email or password",
        };
        return res.send(json);
      }
    }

  } catch (e) {
    console.error("Controller: user | Method: _login | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while login user!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Forgot Password
*/
async function _forgotPassword(req, res) {
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

    const { email } = req.body;
    const existUser = await USER_COLLECTION.findOne({
      email: email,
      isDeleted: false,
    });
    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exist!",
        error: "User does not exist!",
      };
      return res.send(json);
    }

    const previousOTPRecord = await ForgotPassword.findOne({
      userId: existUser._id,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let mailOptions = {
      from: '"Your App Name" <your_email@example.com>',
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
      html: `<b>Your OTP for password reset is: ${otp}</b>`,
    };

    if (previousOTPRecord) {
      await ForgotPassword.updateOne({ userId: existUser._id }, { otp });
      await COMMON.sendEmail(mailOptions);
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "OTP re-sent successfully",
      };

      return res.send(json);
    } else {
      await ForgotPassword.create({
        userId: existUser._id,
        email: existUser.email,
        otp,
      });

      await COMMON.sendEmail(mailOptions);

      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "OTP send Succesfully",
      };

      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: user | Method: _forgotPassword | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while forgot password",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: OTP Verification
*/
async function _OTPVerification(req, res) {
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

    const { email, otp } = req.body;
    const user = await USER_COLLECTION.findOne({
      email: email,
      isDeleted: false,
    });

    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exist!",
        error: "User does not exist!",
      };
      return res.send(json);
    }

    const forgotPasswordRecord = await ForgotPassword.findOne({
      userId: user._id,
    });

    if (!forgotPasswordRecord) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Please re-generate an OTP",
      };

      return res.send(json);
    }

    const otpTime = forgotPasswordRecord.updatedAt;
    if (!COMMON.isOtpValid(otpTime, 1)) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "OTP has been expired, please generate new one",
      };

      return res.send(json);
    }
    if (otp === forgotPasswordRecord.otp) {
      const encryptedEmail = await COMMON.encryptPassword(email);
      await ForgotPassword.findByIdAndDelete({ _id: forgotPasswordRecord._id });

      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "OTP verified Successfully",
        token: encryptedEmail,
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "OTP is incorrect",
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: user | Method: _OTPVerification | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while otp verification!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Change password
*/
async function _changePassword(req, res) {
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

    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "password does not match",
        error: "Password does not match",
      };
      return res.send(json);
    }

    const email = await COMMON.decryptPassword(token);

    const user = await USER_COLLECTION.findOne({
      email: email,
      isDeleted: false,
    });

    if (!user) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exist!",
        error: "User does not exist!",
      };
      return res.send(json);
    }

    const oldPassword = await COMMON.decryptPassword(user.password);
    if (oldPassword === password) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Password is same as Old Password",
        error: "Password is same as Old Password",
      };
      return res.send(json);
    }

    const encryptPassword = await COMMON.encryptPassword(password);
    await USER_COLLECTION.findByIdAndUpdate(
      { _id: user._id },
      { password: encryptPassword }
    );
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Password change successfully",
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: user | Method: _changePassword | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while changing password!",
      error: e,
    };
    return res.send(json);
  }
}
/*
TYPE: Post
TODO: Reset password
*/
async function _resetPassword(req, res) {
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

    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { email } = req.decoded;

    if (newPassword !== confirmPassword) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "password does not match",
        error: "Password does not match",
      };
      return res.send(json);
    }

    const user = await USER_COLLECTION.findOne({ email });

    const userOldPassword = await COMMON.decryptPassword(user.password);

    if (userOldPassword !== oldPassword) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Old Password does not match",
        error: "Old Password does not match",
      };
      return res.send(json);
    }

    const encryptPassword = await COMMON.encryptPassword(newPassword);

    await USER_COLLECTION.findByIdAndUpdate(
      { _id: user._id },
      { password: encryptPassword }
    );

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Password change successfully",
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: user | Method: _resetPassword | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while reseting password!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get user by id
*/
async function _getUserById(req, res) {
  try {
    const id = req.params.id;
    const query = { _id: id, isDeleted: false };
    const existUser = await USER_COLLECTION.findOne(query, {
      password: 0,
    }).populate({
      path: "roleId",
      model: "role",
      select: ["name"],
    });
    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exists!",
        error: "User does not exists!",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = { message: "User found successfully!", data: existUser };
    return res.send(json);
  } catch (e) {
    console.error("Controller: user | Method: _getUserById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get user!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all users
*/
async function _getUsers(req, res) {
  try {
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit && pageCount;
    const query = { isDeleted: false };
    if (req.body.search) {
      if (req.body.search.firstName) {
        const firstNameQuery = {
          firstName: {
            $regex: new RegExp(
              "^" + search.firstName.trim().toLowerCase(),
              "i"
            ),
          },
        };
        query = Object.assign({}, query, firstNameQuery);
      }
      if (req.body.search.lastName) {
        const lastNameQuery = {
          lastName: {
            $regex: new RegExp("^" + search.lastName.trim().toLowerCase(), "i"),
          },
        };
        query = Object.assign({}, query, lastNameQuery);
      }
      if (req.body.search.email) {
        var emailQuery = {
          email: {
            $regex: new RegExp("^" + search.email.trim().toLowerCase(), "i"),
          },
        };
        query = Object.assign({}, query, emailQuery);
      }
    }
    var totalRecords = await USER_COLLECTION.countDocuments(query);
    var result = await USER_COLLECTION.find(query, { password: 0 })
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit);
    if (result) {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Users found successfully!",
        data: result,
        totalRecords: totalRecords,
      };
      return res.send(json);
    }
    json.status = CONSTANT.FAIL;
    json.result = { message: "Users not found!", error: "Users not found!" };
    return res.send(json);
  } catch (e) {
    console.error("Controller: user | Method: _getUsers | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get users!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update user by id
*/
async function _updateUserById(req, res) {
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
    const { firstName, lastName, email, roleId } = req.body;
    const query = { _id: id, isDeleted: false };
    const existUser = await USER_COLLECTION.findOne(query);
    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exists!",
        error: "User does not exists!",
      };
      return res.send(json);
    }
    const userObj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      roleId: roleId,
    };
    USER_COLLECTION.findByIdAndUpdate(id, userObj, { new: true })
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "User uploaded successfully!",
          data: result,
        };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while update user!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: user | Method: _updateUserById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update user!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Delete user by id
*/
async function _deleteUserById(req, res) {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const query = { _id: id, isDeleted: false };
    const existUser = await USER_COLLECTION.findOne(query);
    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exists!",
        error: "User does not exists!",
      };
      return res.send(json);
    }
    USER_COLLECTION.findByIdAndUpdate(id, { isDeleted: true })
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = { message: "User deleted successfully!", data: {} };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while delete user!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error("Controller: user | Method: _deleteUserById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete user!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update user profile
*/
async function _updateProfile(req, res) {
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

    const { firstName, lastName } = req.body;
    const { email } = req.decoded;
    const profilePhoto = req.file;

    const updateFields = {
      firstName,
      lastName,
    };
    if (profilePhoto) {
      updateFields.profilePhoto = profilePhoto.filename;
    }

    const updatedUser = await USER_COLLECTION.findOneAndUpdate(
      { email },
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "roleId",
      model: "Role",
      select: ["name"],
    });
    if (!updatedUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to update profile",
        error: "Fail to updated Pofile",
      };
      return res.send(json);
    }
    const { password, createdAt, updatedAt, ...sanitizeUser } =
      updatedUser.toObject();
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "update profile success",
      data: {
        updatedUser: sanitizeUser,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: user | Method: _updateUserById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update user!", error: e };
    return res.send(json);
  }
}

