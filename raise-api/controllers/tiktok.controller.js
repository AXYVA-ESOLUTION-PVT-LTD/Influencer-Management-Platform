const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const CLIENT_ID = process.env.PROD_TIKTOK_CLIENT_ID;
const CLIENT_SECRET = process.env.PROD_TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.PROD_REDIRECT_URI;
const USER_COLLECTION = require("../module/user.module");
const jwt = require("jsonwebtoken");
const qs = require("qs");

exports.auth = _auth;
exports.authCallback = _authCallback;
async function _auth(req, res) {
  try {
    const csrfState = Math.random().toString(36).substring(2);

    let url = "https://www.tiktok.com/v2/auth/authorize/";
    url += `?client_key=${CLIENT_ID}`;
    url += "&scope=user.info.basic";
    url += "&scope=user.info.profile";
    url += "&scope=user.info.stats";
    url += "&response_type=code";
    url += `&redirect_uri=${REDIRECT_URI}`;
    url += `&state=${csrfState}`;

    // json.status = CONSTANT.SUCCESS;
    // json.result = {
    //   message: "Authentication url generated successfully",
    //   authUrl: url,
    // };
    // return res.send(json);
    res.redirect(url);
    // res.json({ url: url });
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while authentication",
      error: error,
    };
    return res.send(json);
  }
}

async function _authCallback(req, res) {
  // const FRONTEND_URL = "http://localhost:3000"; //localhost 
  const FRONTEND_URL = "http://dash.brandraise.io"; //server

  try {
    const fetch = (await import("node-fetch")).default;

    const { code } = req.query;
    const tokenURL = "https://open.tiktokapis.com/v2/oauth/token/";
    const body = qs.stringify({
      client_key: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    const data = await response.json();
    const accessToken = data.access_token;

    const userInfoResponse = await fetch(
      `https://open-api.tiktok.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const userInfo = await userInfoResponse.json();

    USER_COLLECTION.findOne({ firstName: userInfo.data.user.username })
      .then(async (existingUser) => {
        let json = {};

        if (existingUser) {
          let userObj = {
            id: existingUser._id,
            firstName: existingUser.firstName,
            roleId: existingUser.roleId,
            appId: existingUser.appId,
            loginType: existingUser.loginType,
          };

          let token = jwt.sign(userObj, process.env.superSecret, {
            expiresIn: 86400,
          });

          const populatedUser = await USER_COLLECTION.findById(
            existingUser._id
          ).populate({
            path: "roleId",
            model: "Role",
            select: ["name"],
          });
          const {
            password: _,
            createdAt,
            updatedAt,
            ...userWithoutSensitiveInfo
          } = populatedUser.toObject();

          // json.status = CONSTANT.SUCCESS;
          // json.result = {
          //   message: "User logged in successfully!",
          //   data: { token: token, user: userWithoutSensitiveInfo },
          // };
          // console.log("User login successful", json);
          // return res.send(json);
          const data = { token: token, user: userWithoutSensitiveInfo };
          const encodedData = encodeURIComponent(JSON.stringify(data));
          const redirectURL = `${FRONTEND_URL}/login/callback?data=${encodedData}`;

          return res.redirect(redirectURL);
        } else {
          const user = new USER_COLLECTION({
            firstName: userInfo.data.user.username,
            roleId: "673c482d2fd73673871770ed",
            appId: userInfo.data.user.open_id,
            loginType: "tiktok",
            status: true,
          });

          user
            .save()
            .then(async (result) => {
              let userObj = {
                id: result._id,
                firstName: result.firstName,
                roleId: result.roleId,
                appId: result.appId,
                loginType: result.loginType,
              };

              let token = jwt.sign(userObj, process.env.superSecret, {
                expiresIn: 86400,
              });

              const createdUser = await USER_COLLECTION.findById(
                result._id
              ).populate({
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

              // json.status = CONSTANT.SUCCESS;
              // json.result = {
              //   message: "User created and logged in successfully!",
              //   data: { token: token, user: userWithoutSensitiveInfo },
              // };
              // console.log("User created and logged in", json);

              // return res.send(json);
              const data = { token: token, user: userWithoutSensitiveInfo };
              const encodedData = encodeURIComponent(JSON.stringify(data));
              const redirectURL = `${FRONTEND_URL}/login/callback?data=${encodedData}`;

              return res.redirect(redirectURL);
            })
            .catch((error) => {
              json.status = CONSTANT.ERROR;
              json.result = { message: "Error creating user", error: error };
              console.log("Error creating user", json);
              return res.send(json);
            });
        }
      })
      .catch((error) => {
        json.status = CONSTANT.ERROR;
        json.result = { message: "Error checking user", error: error };
        console.log("Error checking user", json);
        return res.send(json);
      });
  } catch (error) {
    console.log(error);

    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while signup with tiktok",
      error: error,
    };
    return res.send(json);
  }
}
