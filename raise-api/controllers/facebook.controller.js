const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const FACEBOOK_CONFIG_ID = process.env.FACEBOOK_CONFIG_ID;
const USER_COLLECTION = require("../module/user.module");
const jwt = require("jsonwebtoken");
const qs = require("qs");
const moment = require("moment");

exports.auth = _auth;
exports.authCallback = _authCallback;
exports.getFacebookUserData = _getFacebookUserData;
exports.MonthlyPerformanceFacebookAnalytics =
  _MonthlyPerformanceFacebookAnalytics;

async function _auth(req, res) {
  try {
    const { token } = req.params;
    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&state=${token}`;
    // const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email&response_type=code&config_id=${FACEBOOK_CONFIG_ID}`;
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Authentication url generated successfully",
      authUrl: url,
    };
    // return res.send(json);
    res.redirect(url);
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
    const params = qs.stringify({
      client_id: FACEBOOK_APP_ID,
      redirect_uri: FACEBOOK_REDIRECT_URI,
      client_secret: FACEBOOK_APP_SECRET,
      code: code,
    });

    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?${params}`;

    const response = await fetch(tokenUrl);

    const data = await response.json();

    const accessToken = data.access_token;

    const userInfoResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
      {
        method: "GET",
      }
    );
    const userInfo = await userInfoResponse.json();

    const decodedToken = jwt.verify(state, process.env.superSecret);

    const userId = decodedToken.id;

    const existUserName = await USER_COLLECTION.findOne({
      username: userInfo.name,
      platform: CONSTANT.FACEBOOK,
    });

    if (existUserName !== null) {
      const redirectURL = `${FRONTEND_URL}/onboarding?message=User%20already%20logged%20in%20with%20this%20Facebook%20account`;
      return res.redirect(redirectURL);
    } else {
      const existingUser = await USER_COLLECTION.findById(userId).populate({
        path: "roleId",
        model: "Role",
        select: ["name"],
      });

      existingUser.username = userInfo.name;
      existingUser.platform = CONSTANT.FACEBOOK;
      existingUser.isVerified = true;
      existingUser.accessToken = accessToken;
      existingUser.status = true;
      existingUser.refreshToken = "";
      existingUser.expiresIn = "";

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
      message: "An error occurred while signup with facebook",
      error: error,
    };
    return res.send(json);
  }
}

async function verifyAndRefreshToken(accessToken) {
  try {
    // First verify the token
    const verifyResponse = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_TOKEN}`,
      { method: "GET" }
    );

    const verifyData = await verifyResponse.json();
    // Check if token is invalid or expired
    if (
      !verifyData.data?.is_valid ||
      verifyData.data?.expires_at * 1000 < Date.now()
    ) {
      console.log("Token is invalid or expired. Attempting to refresh...");
      return await refreshAccessToken(accessToken);
    }

    return { accessToken, valid: true };
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
}

async function refreshAccessToken(accessToken) {
  try {
    const refreshURL = "https://graph.facebook.com/v19.0/oauth/access_token";

    // Prepare the query parameters
    const params = {
      grant_type: "fb_exchange_token",
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      fb_exchange_token: accessToken, // Note: Facebook uses fb_exchange_token, not refresh_token
    };

    // Convert params to query string
    const queryString = qs.stringify(params);

    // Make the refresh request
    const response = await fetch(`${refreshURL}?${queryString}`, {
      method: "GET", // Facebook's token endpoint uses GET
    });

    const data = await response.json();

    if (data.error) {
      console.log("error on generate a New Token");
      throw new Error(data.error.message);
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      valid: true,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

async function _getFacebookUserData(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  try {
    // Step 1: Verify and refresh the access token
    const { accessToken: validAccessToken, valid } = await verifyAndRefreshToken(accessToken);

    if (!valid) {
      throw new Error("Invalid or expired access token.");
    }

    // Step 1: Fetch user info and posts
    const userInfo = await fetchUserInfo(validAccessToken);

    const posts = userInfo.posts?.data || [];
    userInfo.post_count = posts.length;
    userInfo.friends_count = userInfo.friends?.summary?.total_count || 0;

    // If no posts are available
    if (posts.length === 0) {
      return res.send({
        status: "Success",
        message: "No posts available.",
        userInfo,
        posts: [],
      });
    }

    // Step 3: Calculate total reactions and comments for all posts
    let totalReactions = 0;
    let totalComments = 0;

    posts.forEach(post => {
      totalReactions += post.reactions?.summary?.total_count || 0;
      totalComments += post.comments?.summary?.total_count || 0;
    });

    // Add total reactions and total comments to user info
    userInfo.totalReactions = totalReactions;
    userInfo.totalComments = totalComments;

    // Return successful response with user info and post details
    return res.send({
      status: "Success",
      message: "User data and post details fetched successfully.",
      userInfo,
      posts,
    });

  } catch (error) {
    // Handle any errors during the process
    console.error("Error fetching Facebook user data:", error);
    return res.status(500).send({
      status: "Fail",
      message: "An error occurred while fetching Facebook user data.",
      error: error.message,
    });
  }
}

// Function to fetch user information including posts and reactions/comments
async function fetchUserInfo(accessToken) {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name,email,age_range,birthday,friends,gender,link,posts{message,created_time,media_type,media_url,permalink,reactions.summary(true),comments.summary(true),permalink_url,link,type}&access_token=${accessToken}`,
    { method: "GET" }
  );
  const userInfo = await response.json();

  if (userInfo.error) {
    throw new Error(userInfo.error.message);
  }

  return userInfo;
}

async function _MonthlyPerformanceFacebookAnalytics(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const currentMonth = moment().format("M");

  try {
    // Step 1: Fetch user data (including posts, reactions, and comments) using fetchUserInfo
    const userInfo = await fetchUserInfo(accessToken);
    const posts = userInfo.posts?.data || [];
    const postCount = posts.length;
    const friendsCount = userInfo.friends?.summary?.total_count || 0;

    if (postCount === 0) {
      return res.send({
        status: "Success",
        message: "No posts available.",
        userInfo,
        posts: [],
      });
    }

    let totalReactions = 0;
    let totalComments = 0;
    let totalShares = 0;

    // Calculate total reactions, comments, and shares from all posts
    posts.forEach((post) => {
      totalReactions += post.reactions?.summary?.total_count || 0;
      totalComments += post.comments?.summary?.total_count || 0;
      totalShares += post.shares?.count || 0;
    });

    userInfo.totalReactions = totalReactions;
    userInfo.totalComments = totalComments;
    userInfo.totalShares = totalShares;

    // Helper functions to extract month and year
    const getMonthYear = (isoTimestamp) => {
      const date = new Date(isoTimestamp);
      return date.getMonth(); // Returns 0-11 (January is 0, February is 1, etc.)
    };

    const getYear = (isoTimestamp) => {
      const date = new Date(isoTimestamp);
      return date.getFullYear(); // Returns year
    };

    const currentYear = new Date().getFullYear();

    // Arrays to store the counts for each month of the current year
    let postCountPerMonth = Array(12).fill(0);
    let engagementRatePerMonth = Array(12).fill(0);
    let commentCountPerMonth = Array(12).fill(0);
    let likeCountPerMonth = Array(12).fill(0);
    let shareCountPerMonth = Array(12).fill(0);

    // Calculate monthly counts for posts and interactions
    posts.forEach((post) => {
      const postYear = getYear(post.created_time);
      if (postYear === currentYear) {
        const month = getMonthYear(post.created_time);

        postCountPerMonth[month]++;
        commentCountPerMonth[month] += post?.comments?.summary?.total_count || 0;
        likeCountPerMonth[month] += post?.reactions?.summary?.total_count || 0;
        shareCountPerMonth[month] += post?.shares?.count || 0;
      }
    });

    // Calculate engagement rate for each month
    engagementRatePerMonth = engagementRatePerMonth.map((_, index) => {
      const totalEngagements =
        likeCountPerMonth[index] +
        commentCountPerMonth[index] +
        shareCountPerMonth[index];

      // Calculate engagement rate: Total Engagements (likes + comments + shares) / friendsCount
      const rate = friendsCount > 0 ? (totalEngagements / friendsCount) * 100 : 0; // Convert to percentage
      return rate;
    });

    // Return the final analytics response
    return res.send({
      status: CONSTANT.SUCCESS,
      result: {
        message: "Analytics processed successfully.",
        postCountArray: postCountPerMonth,
        engagementRateArray: engagementRatePerMonth,
        likeCountArray: likeCountPerMonth,
        commentCountArray: commentCountPerMonth,
        shareCountArray: shareCountPerMonth,
      },
    });

  } catch (error) {
    console.error("Error fetching Facebook analytics data:", error);
    return res.send({
      status: CONSTANT.FAIL,
      result: {
        message: "An error occurred while processing analytics.",
        error: error.message,
      },
    });
  }
}

