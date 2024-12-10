const jwt = require("jsonwebtoken");
require("dotenv").config();
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant.js");
const { generateAccessToken } = require("../helper/tokenUtil.js");

exports.getRefreshToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const json = {};

  if (!authHeader) {
    json.status = CONSTANT.FAIL;
    json.result = { message: "Token is required" };
    return res.status(400).json(json);
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const user = jwt.verify(token, process.env.superSecret);

    const existUser = await USER_COLLECTION.findOne({
      email: user.email
    })

    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = { message: "User does not exist" };
      return res.status(404).json(json);
    }

    const userObj = {
      id: existUser.id,
      email: existUser.email,
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      roleId: existUser.roleId,
    };
    
    const newAccessToken = generateAccessToken(userObj);

    json.status = CONSTANT.SUCCESS;
    json.result = { message: "Access token generated successfully",  accessToken: newAccessToken};
    return res.json(json);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const existUser = await USER_COLLECTION.findOne({
        email: decoded.email
      })

      if (!existUser) {
        json.status = CONSTANT.FAIL;
        json.result = { message: "User does not exist" };
        return res.status(404).json(json);
      }

      const userObj = {
        id: existUser.id,
        email: existUser.email,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        roleId: existUser.roleId,
      };

      const newAccessToken = generateAccessToken(userObj);

      json.status = CONSTANT.SUCCESS;
      json.result = { message: "Access token regenerated for expired token", accessToken: newAccessToken };
      return res.json(json);
    } else {
      console.log("Error:", error);
      json.status = CONSTANT.FAIL;
      json.result = { message: "Invalid token", error: error.message };
      return res.status(403).json(json);
    }
  }
};
