const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const CLIENT_ID = process.env.PROD_TIKTOK_CLIENT_ID;
const CLIENT_SECRET = process.env.PROD_TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.PROD_REDIRECT_URI;
const USER_COLLECTION = require("../module/user.module");
const jwt = require("jsonwebtoken");
const qs = require("qs");
const Role = require("../module/role.module.js");
const ROLES = require("../config/role.js");
const moment = require("moment");

exports.auth = _auth;
exports.authCallback = _authCallback;
exports.getTikTokUserData = _getTikTokUserData;
exports.MonthlyPerformanceTikTokAnalytics = _MonthlyPerformanceTikTokAnalytics;

async function _auth(req, res) {
  const { token } = req.params;

  try {
    let url = "https://www.tiktok.com/v2/auth/authorize/";
    url += `?client_key=${CLIENT_ID}`;
    url += "&scope=user.info.basic";
    url += "&scope=user.info.profile";
    url += "&scope=user.info.stats";
    url += "&scope=video.list";
    url += "&response_type=code";
    url += `&redirect_uri=${REDIRECT_URI}`;
    url += `&state=${token}`;

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
  const FRONTEND_URL = process.env.FRONTEND_URL;

  try {
    const fetch = (await import("node-fetch")).default;

    const { code, state } = req.query;

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
    const refreshToken = data.refresh_token;
    const newExpiresIn = data.expires_in;
    const newExpiryTime = Date.now() + newExpiresIn * 1000;

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

    const decodedToken = jwt.verify(state, process.env.superSecret);

    const userId = decodedToken.id;

    const existUserName = await USER_COLLECTION.findOne({
      username: userInfo.data.user.username,
      platform: CONSTANT.TIKTOK,
    });

    if (existUserName) {
      const redirectURL = `${FRONTEND_URL}/onboarding?message=User%20already%20logged%20in%20with%20this%20TikTok%20account`;
      return res.redirect(redirectURL);
    } else {

      const existingUser = await USER_COLLECTION.findById(userId).populate({
        path: "roleId",
        model: "Role",
        select: ["name"],
      });

      existingUser.username = userInfo.data.user.username;
      existingUser.platform = CONSTANT.TIKTOK;
      existingUser.isVerified = true;
      existingUser.accessToken = accessToken;
      existingUser.status = true;
      existingUser.refreshToken = refreshToken;
      existingUser.expiresIn = newExpiryTime;

      await existingUser.save();

      let userObj = {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        roleId: existingUser.roleId,
        accessToken: existingUser.accessToken,
        platform: existingUser.platform,
        username: existingUser.username,
      };

      const newToken = jwt.sign(userObj, process.env.superSecret, {
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

      const datas = { token: newToken, user: userWithoutSensitiveInfo };
      const encodedData = encodeURIComponent(JSON.stringify(datas));
      const redirectURL = `${FRONTEND_URL}/login/callback?data=${encodedData}`;

      return res.redirect(redirectURL);
    }
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

async function handleUserToken(accessToken) {
  try {
    const existingUser = await USER_COLLECTION.findOne({
      accessToken: accessToken,
    });
    
    if (!existingUser) {
      throw new Error("User not found");
    }

    const expireTokenTime = existingUser.expiresIn;
    const refreshToken = existingUser.refreshToken;

    if (isTokenExpired(expireTokenTime)) {
      // Refresh the token if expired
      const { newAccessToken, newExpiryTime, newRefreshToken } =
        await refreshAccessToken(refreshToken);

      try {
        const result = await USER_COLLECTION.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              accessToken: newAccessToken,
              expiresIn: newExpiryTime,
              refreshToken: newRefreshToken,
            },
          }
        );

        return newAccessToken;
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Token is still valid
      return accessToken;
    }
  } catch (error) {
    console.error("Error handling token:", error);
  }
}

function isTokenExpired(expiryTime) {
  return Date.now() > expiryTime;
}

async function refreshAccessToken(refreshToken) {
  try {
    const refreshURL = "https://open.tiktokapis.com/v2/oauth/token/";
    const body = qs.stringify({
      client_key: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(refreshURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    const data = await response.json();
    const newAccessToken = data.access_token;
    const newExpiresIn = data.expires_in;
    const newRefreshToken = data.refresh_token;

    const newExpiryTime = Date.now() + newExpiresIn * 1000;

    return { newAccessToken, newExpiryTime, newRefreshToken };
  } catch (error) {
    console.log(error);
  }
}

async function _getTikTokUserData(req, res) {
  let accessToken = req.headers.authorization?.split(" ")[1];
  let validAccessToken = await handleUserToken(accessToken);
  if (validAccessToken === undefined) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Invalid or expired access token. Please authenticate again.",
    };
    return res.send(json);
  }
  try {
    const userInfoPromise = fetch(
      `https://open-api.tiktok.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,avatar_url_100,avatar_large_url,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const videoDataPromise = fetch(
      `https://open-api.tiktok.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,view_count,share_count,like_count,video_description,share_url,create_time,comment_count,embed_html,height,width`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_count: 20,
        }),
      }
    );

    const [userInfoResponse, userVideoResponse] = await Promise.all([
      userInfoPromise,
      videoDataPromise,
    ]);

    const userInfo = await userInfoResponse.json();
    const videoData = await userVideoResponse.json();

    if (userInfo.error.message.trim() !== "") {
      console.error("Error fetching user info:", userInfo.error.message);
      throw new Error("Failed to fetch user info.");
    }

    if (videoData.error.message.trim() !== "") {
      console.error("Error fetching video data:", videoData.error.message);
      throw new Error("Failed to fetch video data.");
    }

    // Extract required data
    const UserBasicInfo = userInfo?.data;
    const userVideoData = videoData?.data?.videos || [];

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "User data fetch successfully",
      userInfo: UserBasicInfo,
      userVideodata: userVideoData,
    };
    return res.send(json);
  } catch (error) {
    console.error("An error occurred while fetch user details : ", error);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while fetch user details",
      error: error,
    };
    return res.send(json);
  }
}

async function _MonthlyPerformanceTikTokAnalytics(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const json = {};
  const currentMonth = moment().format("M");
  let validAccessToken = await handleUserToken(accessToken);
  if (validAccessToken === undefined) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Invalid or expired access token. Please authenticate again.",
    };
    return res.send(json);
  }
  try {
    const videoDataPromise = fetch(
      `https://open-api.tiktok.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,view_count,share_count,like_count,video_description,share_url,create_time,comment_count,embed_html,height,width`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_count: 20,
        }),
      }
    );
    const [userVideoResponse] = await Promise.all([videoDataPromise]);

    const videoData = await userVideoResponse.json();

    if (videoData.error.message.trim() !== "") {
      console.error("Error fetching video data:", videoData.error.message);
      throw new Error("Failed to fetch video data.");
    }

    const userVideoData = videoData?.data?.videos || [];

    if (!Array.isArray(userVideoData) || userVideoData.length === 0) {
      throw new Error("Invalid or missing userVideoData in request body.");
    }

    const getMonthYear = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    };
    
    // const getMonthYear = (timestamp) => {
    //   const date = new Date(timestamp * 1000);
    //   return date.getMonth();
    // };

    let postCountPerMonth = Array(12).fill(0);
    let engagementRatePerMonth = Array(12).fill(0);
    let commentCountPerMonth = Array(12).fill(0);
    let likeCountPerMonth = Array(12).fill(0);
    let shareCountPerMonth = Array(12).fill(0);
    let viewCountPerMonth = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    await Promise.all(
      userVideoData
        .filter((video) => {
          const { year } = getMonthYear(video.create_time);
          return year === currentYear; // Filter for videos created in the current year
        })
        .map((video) => {
          return new Promise((resolve) => {
            const { month } = getMonthYear(video.create_time);
    
            postCountPerMonth[month]++;
            commentCountPerMonth[month] += video.comment_count || 0;
            likeCountPerMonth[month] += video.like_count || 0;
            shareCountPerMonth[month] += video.share_count || 0;
            viewCountPerMonth[month] += video.view_count || 0;
    
            resolve();
          });
        })
    );
    // await Promise.all(
    //   userVideoData.map((video) => {
    //     return new Promise((resolve) => {
    //       const month = getMonthYear(video.create_time);
    //       postCountPerMonth[month]++;
    //       commentCountPerMonth[month] += video.comment_count;
    //       likeCountPerMonth[month] += video.like_count;
    //       shareCountPerMonth[month] += video.share_count;
    //       viewCountPerMonth[month] += video.view_count;
    //       resolve();
    //     });
    //   })
    // );

    engagementRatePerMonth = engagementRatePerMonth.map((_, index) => {
      const views = viewCountPerMonth[index];
      if (views > 0) {
        return (
          ((likeCountPerMonth[index] +
            commentCountPerMonth[index] +
            shareCountPerMonth[index]) /
            views) *
          100
        );
      }
      return 0;
    });

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Analytics processed successfully",
      postCountArray: postCountPerMonth,
      engagementRateArray: engagementRatePerMonth,
      commentCountArray: commentCountPerMonth,
    };
    return res.send(json);
  } catch (error) {
    console.error(
      "An error occurred while processing Monthly analytics : ",
      error
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while processing analytics",
      error: error.message,
    };

    return res.send(json);
  }
}
