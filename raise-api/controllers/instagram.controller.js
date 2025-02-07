const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const USER_COLLECTION = require("../module/user.module");
const jwt = require("jsonwebtoken");
const qs = require("qs");
const moment = require("moment");

exports.auth = _auth;
exports.authCallback = _authCallback;
exports.webHookAuthCallback = _webHookAuthCallback;
exports.getInstagramUserData = _getInstagramUserData;
exports.MonthlyPerformanceInstagramAnalytics =
  _MonthlyPerformanceInstagramAnalytics;

async function _auth(req, res) {
  try {
    if (!INSTAGRAM_APP_ID || !INSTAGRAM_REDIRECT_URI) {
      throw new Error(
        "Missing Instagram app credentials in environment variables."
      );
    }

    const state = req.params.token || "default_state";
    const params = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      response_type: "code",
      scope:
        "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish",
      state: state,
    });

    const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;

    res.redirect(authUrl);
  } catch (error) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while generating authentication URL",
      error: error.message,
    };
    return res.send(json);
  }
}

async function _webHookAuthCallback(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    if (mode === "subscribe") {
      console.log("Webhook verified successfully!");
      res.status(200).send(challenge);
    }
  } else {
    res.status(403).send("Forbidden");
  }
}

async function exchangeForLongLivedToken(shortLivedToken, clientSecret) {
  try {
    // Construct the endpoint URL with required parameters
    const exchangeUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedToken}`;

    // Make the API request
    const response = await fetch(exchangeUrl, { method: "GET" });
    const data = await response.json();

    // Handle errors if any
    if (data.error) {
      throw new Error(data.error.message);
    }

    const newTokenExpiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
    return {
      accessToken: data.access_token,
      expiresIn: newTokenExpiresAt,
    };
  } catch (error) {
    console.error(
      "Error exchanging short-lived token for long-lived token:",
      error.message
    );
    return null;
  }
}

async function _authCallback(req, res) {
  const FRONTEND_URL = process.env.FRONTEND_URL;

  try {
    const fetch = (await import("node-fetch")).default;
    const { code, state } = req.query;

    if (!code) {
      throw new Error("Missing 'code' parameter in query");
    }

    const params = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code,
    });

    const tokenUrl = "https://api.instagram.com/oauth/access_token";

    const response = await fetch(tokenUrl, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error details:", errorDetails);
      throw new Error(`Failed to fetch access token: ${errorDetails}`);
    }

    const data = await response.json();

    const { access_token: accessToken, user_id: userId } = data;

    const result = await exchangeForLongLivedToken(
      accessToken,
      INSTAGRAM_APP_SECRET
    );

    const userInfoResponse = await fetch(
      `https://graph.instagram.com/v22.0/me?fields=id,username&access_token=${result.accessToken}`
    );

    if (!userInfoResponse.ok) {
      throw new Error(
        `Failed to fetch user info: ${userInfoResponse.status} ${userInfoResponse.statusText}`
      );
    }

    const userInfo = await userInfoResponse.json();

    const decodedToken = jwt.verify(state, process.env.superSecret);
    const user_Id = decodedToken.id;

    const existUserName = await USER_COLLECTION.findOne({
      username: userInfo.username,
      platform: CONSTANT.INSTAGRAM,
    });

    if (existUserName !== null) {
      const redirectURL = `${FRONTEND_URL}/onboarding?message=User%20already%20logged%20in%20with%20this%20Instagram%20account`;
      return res.redirect(redirectURL);
    } else {

      const existingUser = await USER_COLLECTION.findById(user_Id).populate({
        path: "roleId",
        model: "Role",
        select: ["name"],
      });

      existingUser.username = userInfo.username;
      existingUser.platform = CONSTANT.INSTAGRAM;
      existingUser.isVerified = true;
      existingUser.accessToken = result.accessToken;
      existingUser.refreshToken = result.accessToken;
      existingUser.status = true;
      existingUser.expiresIn = result.expiresIn;

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
    console.error("Authentication error:", error);
    return res.send({
      status: "Fail",
      result: {
        message: "Instagram authentication failed",
        error: error.message,
      },
    });
  }
}

async function _getInstagramUserData(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  try {
    // Fetch user profile data and media data
    const userInfo = await fetchInstagramUserInfo(accessToken);

    return res.send({
      status: "Success",
      message: "Instagram user data fetched successfully.",
      userInfo,
    });
  } catch (error) {
    console.error("Error fetching Instagram user data:", error);
    return res.status(500).send({
      status: "Fail",
      message: "An error occurred while fetching Instagram user data.",
      error: error.message,
    });
  }
}

async function fetchInstagramUserInfo(accessToken) {
  // Fetch user profile data
  const profileUrl = `https://graph.instagram.com/me?fields=id,username,account_type,followers_count,follows_count,media_count&access_token=${accessToken}`;
  const userProfileResponse = await fetch(profileUrl, { method: "GET" });
  const userProfile = await userProfileResponse.json();

  if (userProfile.error) {
    throw new Error(userProfile.error.message);
  }

  // Fetch media posts data along with insights using Instagram Graph API
  const mediaUrl = `https://graph.instagram.com/${userProfile.id}/media?fields=id,caption,media_type,media_url,timestamp,permalink,insights.metric(reach,likes,comments,saved,shares)&access_token=${accessToken}`;
  const mediaResponse = await fetch(mediaUrl, { method: "GET" });
  const mediaData = await mediaResponse.json();

  // Process media data and format insights
  const mediaWithInsights = mediaData.data.map((post) => {
    const insights = post.insights?.data?.reduce((acc, metric) => {
      acc[metric.name] = metric.values[0]?.value || 0;
      return acc;
    }, {}) || { reach: 0, likes: 0, comments: 0, saved: 0, shares: 0 };

    return { ...post, insights };
  });

  

  // Calculate total values for posts, likes, and reach
  let totalPosts = mediaWithInsights.length;
  let totalLikes = mediaWithInsights.reduce(
    (acc, post) => acc + (post.insights.likes || 0),
    0
  );

  return {
    id: userProfile.id,
    username: userProfile.username,
    account_type: userProfile.account_type,
    followers_count: userProfile.followers_count,
    follows_count: userProfile.follows_count,
    media_count: userProfile.media_count,
    totalPosts,
    totalLikes,
    media: mediaWithInsights,
  };
}

async function _MonthlyPerformanceInstagramAnalytics(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const json = {};
  const currentMonth = moment().format("M");

  try {
    // Step 1: Fetch Instagram user info including media and insights
    const instagramData = await fetchInstagramUserInfo(accessToken);
    const mediaWithInsights = instagramData.media;
    // Step 2: Process insights and organize data by month
    const currentYear = new Date().getFullYear();

    const getMonthYear = (timestamp) => {
      const date = new Date(timestamp);
      return { month: date.getMonth(), year: date.getFullYear() };
    };

    let postCountPerMonth = Array(12).fill(0);
    let engagementRatePerMonth = Array(12).fill(0);
    let commentCountPerMonth = Array(12).fill(0);
    let likeCountPerMonth = Array(12).fill(0);
    let shareCountPerMonth = Array(12).fill(0);
    let viewCountPerMonth = Array(12).fill(0);

    // Step 3: Calculate analytics for each post in the current year
    await Promise.all(
      mediaWithInsights
        .filter((post) => {
          const { year } = getMonthYear(post.timestamp);
          return year === currentYear; // Filter for posts created in the current year
        })
        .map((post) => {
          const { month } = getMonthYear(post.timestamp);
          postCountPerMonth[month]++;
          commentCountPerMonth[month] += post.insights?.comments || 0;
          likeCountPerMonth[month] += post.insights?.likes || 0;
          shareCountPerMonth[month] += post.insights?.shares || 0;
          viewCountPerMonth[month] += post.insights?.reach || 0;
        })
    );

    // Step 4: Calculate engagement rates for each month
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

    // Step 5: Prepare response data
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Instagram analytics processed successfully",
      postCountArray: postCountPerMonth,
      engagementRateArray: engagementRatePerMonth,
      commentCountArray: commentCountPerMonth,
      likeCountArray: likeCountPerMonth,
      shareCountArray: shareCountPerMonth,
      viewCountArray: viewCountPerMonth,
    };
    return res.send(json);
  } catch (error) {
    console.error(
      "An error occurred while processing Instagram monthly analytics:",
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
