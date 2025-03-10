const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const CLIENT_ID = process.env.PROD_TIKTOK_CLIENT_ID;
const CLIENT_SECRET = process.env.PROD_TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.PROD_REDIRECT_URI;
const USER_COLLECTION = require("../module/user.module");
const USER_PROFILE_COLLECTION = require("../module/userProfile.module");
const USER_POST_COLLECTION = require("../module/userPost.module");
const USER_DATA_COLLECTION = require("../module/userData.module");
const MONTHLY_PERFORMANCE_COLLECTION = require("../module/monthlyPerformance.module");
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
    const refreshTokenExpire = data.refresh_expires_in;
    const newExpiryTime = Date.now() + newExpiresIn * 1000;
    const refreshTokenExpireTime = Date.now() + refreshTokenExpire * 1000;

    const userInfoResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username`,
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
      const currentTime = Date.now();
      const refreshTokenExpireIn = Number(existUserName.refreshTokenExpireIn);

      if (refreshTokenExpireIn && currentTime < refreshTokenExpireIn) {
        return res.redirect(
          `${FRONTEND_URL}/onboarding?message=User%20already%20logged%20in%20with%20this%20TikTok%20account`
        );
      }
    }
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
    existingUser.refreshTokenExpireIn = refreshTokenExpireTime;

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
      const { newAccessToken, newExpiryTime } = await refreshAccessToken(
        refreshToken
      );

      try {
        const result = await USER_COLLECTION.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              accessToken: newAccessToken,
              expiresIn: newExpiryTime,
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
    const newExpiryTime = Date.now() + newExpiresIn * 1000;

    return { newAccessToken, newExpiryTime };
  } catch (error) {
    console.log(error);
  }
}

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

async function fetchAndStoreTikTokProfile(userInfo, userId) {
  try {
    // Check if the profile already exists
    const existingProfile = await USER_PROFILE_COLLECTION.findOne({ userId });

    if (existingProfile) {
      console.log("⏭️ TikTok profile already exists. Skipping insertion.");
      return; // Exit the function if the profile exists
    }

    // Insert new TikTok profile into the database
    await USER_PROFILE_COLLECTION.create({
      name: userInfo?.data?.user?.username,
      platform: CONSTANT.TIKTOK,
      description: userInfo?.data?.user?.bio_description || "",
      profile_link: userInfo?.data?.user?.profile_deep_link,
      picture_url: userInfo?.data?.user?.avatar_large_url || userInfo?.data?.user?.avatar_url || "",
      follower_count: userInfo?.data?.user?.follower_count || 0,
      follows_count: userInfo?.data?.user?.following_count || 0,
      total_videos: userInfo?.data?.user?.video_count || 0,
      userId,
    });

    console.log("✅ TikTok profile inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting TikTok user data:", error.message);
  }
}

async function fetchAndStoreTiktokVideo(videoData, userId) {
  if (!videoData?.data?.videos || !Array.isArray(videoData.data.videos)) {
    console.error("Invalid video data format");
    return;
  }

  const videos = videoData.data.videos.map((video) => ({
    post_id: video.id,
    post_image_url: video.cover_image_url || "",
    post_url: video.share_url,
    post_title: video.title || "",
    post_created_time: new Date(video.create_time * 1000), // Convert Unix timestamp to Date
    platform: CONSTANT.TIKTOK,
    comment_count: video.comment_count || 0,
    like_count: video.like_count || 0,
    share_count: video.share_count || 0,
    view_count: video.view_count || 0,
    userId, // Pass userId dynamically when calling this function
  }));

  try {
    // Fetch existing post IDs from the database
    const existingPosts = await USER_POST_COLLECTION.find(
      { post_id: { $in: videos.map((v) => v.post_id) } },
      { post_id: 1 }
    );

    const existingPostIds = new Set(existingPosts.map((post) => post.post_id));

    // Filter out videos that already exist
    const newVideos = videos.filter((video) => !existingPostIds.has(video.post_id));

    if (newVideos.length === 0) {
      console.log("No new videos to store.");
      return;
    }

    // Insert only new videos
    await USER_POST_COLLECTION.insertMany(newVideos);
    console.log(`${newVideos.length} new videos stored successfully!`);
  } catch (error) {
    console.error("Error storing videos:", error);
  }
};

async function _getTikTokUserData(req, res) {
  let accessToken = req.headers.authorization?.split(" ")[1];

  // Find userId from accessToken in USER_COLLECTION
  const user = await USER_COLLECTION.findOne({ accessToken });
  if (!user) {
    return res.status(404).send({ status: "Fail", message: "User not found" });
  }

  const userId = user._id;

  // Check if data exists in UserData collection
  let userData = await USER_DATA_COLLECTION.findOne({ userId });

  if (userData && isToday(userData.updatedAt)) {
    return res.send({
      status: "Success",
      result: {
        message: "User data fetch successfully",
        userInfo: {
          user: {
            likes_count: userData.tiktok.likes_count,
            video_count: userData.tiktok.video_count,
            follower_count: userData.tiktok.follower_count,
            following_count: userData.tiktok.following_count,
          },
        },
      },
    });
    
  }

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
      `https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,avatar_url_100,avatar_large_url,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const videoDataPromise = fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,view_count,share_count,like_count,video_description,share_url,create_time,comment_count,embed_html,height,width`,
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

    // console.log("userInfo : " + JSON.stringify(userInfo))
    fetchAndStoreTikTokProfile(userInfo, userId);
    // console.log("videoData : " + JSON.stringify(videoData))
    fetchAndStoreTiktokVideo(videoData, userId);
    // Extract required data
    const UserBasicInfo = userInfo?.data;
    const userVideoData = videoData?.data?.videos || [];

    const userDataInfo = {
      likes_count: UserBasicInfo?.user?.likes_count || 0,
      follower_count: UserBasicInfo?.user?.follower_count || 0,
      following_count: UserBasicInfo?.user?.following_count || 0,
      video_count: UserBasicInfo?.user?.video_count || 0,
    };

    // Case 1: If no document exists, create new record
    if (!userData) {
      userData = new USER_DATA_COLLECTION({
        userId,
        tiktok: userDataInfo,
      });
      await userData.save();
    } else {
      // Case 3: If outdated, update record
      await USER_DATA_COLLECTION.updateOne(
        { userId },
        { tiktok: userDataInfo, updatedAt: new Date() }
      );
    }

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

  // Find userId from accessToken
  const user = await USER_COLLECTION.findOne({ accessToken });
  if (!user) {
    return res.status(404).send({ status: "Fail", message: "User not found" });
  }

  const userId = user._id;

  // Check if data exists in MonthlyPerformance collection
  let monthlyPerformance = await MONTHLY_PERFORMANCE_COLLECTION.findOne({
    userId,
  });

  if (monthlyPerformance && isToday(monthlyPerformance.updatedAt)) {
    return res.send({
      status: "Success",
      result: {
        message: "Tiktok analytics fetched from database.",
        postCountArray: monthlyPerformance.monthlyPostCount,
        engagementRateArray: monthlyPerformance.monthlyEngagementRate,
        commentCountArray: monthlyPerformance.monthlyCommentCount,
      },
    });
  }

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
      `https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,view_count,share_count,like_count,video_description,share_url,create_time,comment_count,embed_html,height,width`,
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

    if (!monthlyPerformance) {
      monthlyPerformance = new MONTHLY_PERFORMANCE_COLLECTION({
        userId,
        monthlyPostCount: postCountPerMonth,
        monthlyEngagementRate: engagementRatePerMonth,
        monthlyCommentCount: commentCountPerMonth,
      });
      await monthlyPerformance.save();
    } else {
      await MONTHLY_PERFORMANCE_COLLECTION.updateOne(
        { userId },
        {
          monthlyPostCount: postCountPerMonth,
          monthlyEngagementRate: engagementRatePerMonth,
          monthlyCommentCount: commentCountPerMonth,
          updatedAt: new Date(),
        }
      );
    }

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
