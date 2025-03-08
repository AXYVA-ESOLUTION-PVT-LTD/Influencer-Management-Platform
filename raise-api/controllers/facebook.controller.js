const json = {};
require("dotenv").config();
const CONSTANT = require("../config/constant");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
const FACEBOOK_CONFIG_ID = process.env.FACEBOOK_CONFIG_ID;
const USER_COLLECTION = require("../module/user.module");
const USER_PROFILE_COLLECTION = require("../module/userProfile.module");
const USER_POST_COLLECTION = require("../module/userPost.module");
const USER_DATA_COLLECTION = require("../module/userData.module");
const MONTHLY_PERFORMANCE_COLLECTION = require("../module/monthlyPerformance.module");
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
    // const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&state=${token}`;

    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&response_type=code&redirect_uri=${FACEBOOK_REDIRECT_URI}&state=${token}&scope=email,pages_show_list,pages_read_engagement,business_management,pages_read_user_content`;

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

    // Step 2: Exchange for Long-Lived Token
    const longLiveParams = qs.stringify({
      grant_type: "fb_exchange_token",
      client_id: FACEBOOK_APP_ID,
      client_secret: FACEBOOK_APP_SECRET,
      fb_exchange_token: data.access_token,
    });

    const longLiveTokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?${longLiveParams}`;
    const tokenResponse = await fetch(longLiveTokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).send({
        status: "Fail",
        message: "Failed to get long-lived token",
        error: tokenData,
      });
    }

    // Step 3: Set Expiry Time (Default 60 Days)
    const expiresInSeconds = tokenData.expires_in || 5184000; // 60 days
    const newTokenExpiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const accessToken = tokenData.access_token;

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
      existingUser.expiresIn = newTokenExpiresAt;
      existingUser.refreshToken = accessToken;
      
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

const fetchFacebookData = async (url, accessToken) => {
  try {
    const response = await fetch(`${url}&access_token=${accessToken}`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from: ${url}`, error);
    return null;
  }
};

const getPageDetails = async (accessToken) => {
  const pagesData = await fetchFacebookData(
    "https://graph.facebook.com/v21.0/me/accounts?fields=id,access_token",
    accessToken
  );
  return pagesData?.data?.[0] || null;
};

const getPagePosts = async (pageId, pageAccessToken) => {
  return fetchFacebookData(
    `https://graph.facebook.com/v21.0/${pageId}/posts?fields=id,message,created_time,permalink_url,full_picture,shares,comments.summary(true),reactions.summary(true)`,
    pageAccessToken
  );
};

const fetchPageDetails = async (pageId, pageAccessToken) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=id,name,about,category,fan_count,followers_count,website,link,picture{url},cover{source}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Error fetching page details:", data.error);
      return { status: "Fail", message: data.error.message };
    }

    return { status: "Success", data };
  } catch (error) {
    console.error("API Error:", error);
    return { status: "Fail", message: "Error fetching page details." };
  }
};

const getPageFollowers = async (pageId, pageAccessToken) => {
  return fetchFacebookData(
    `https://graph.facebook.com/v21.0/${pageId}?fields=followers_count`,
    pageAccessToken
  );
};

const calculateEngagementStats = (posts) => {
  let totalReactions = 0;
  let totalComments = 0;
  let totalShares = 0;
  let postCountPerMonth = Array(12).fill(0);
  let engagementRatePerMonth = Array(12).fill(0);
  let commentCountPerMonth = Array(12).fill(0);
  let likeCountPerMonth = Array(12).fill(0);
  let shareCountPerMonth = Array(12).fill(0);

  const currentYear = new Date().getFullYear();

  posts.forEach((post) => {
    const postDate = new Date(post.created_time);
    if (postDate.getFullYear() === currentYear) {
      const month = postDate.getMonth();
      postCountPerMonth[month]++;
      commentCountPerMonth[month] += post?.comments?.summary?.total_count || 0;
      likeCountPerMonth[month] += post?.reactions?.summary?.total_count || 0;
      shareCountPerMonth[month] += post?.shares?.count || 0;
    }
    totalReactions += post?.reactions?.summary?.total_count || 0;
    totalComments += post?.comments?.summary?.total_count || 0;
    totalShares += post?.shares?.count || 0;
  });

  return {
    totalReactions,
    totalComments,
    totalShares,
    postCountPerMonth,
    commentCountPerMonth,
    likeCountPerMonth,
    shareCountPerMonth,
  };
};

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

async function _getFacebookUserData(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken)
    return res
      .status(400)
      .send({ status: "Fail", message: "Missing access token" });

  try {
    // Find userId from accessToken in USER_COLLECTION
    const user = await USER_COLLECTION.findOne({ accessToken });
    if (!user) {
      return res
        .status(404)
        .send({ status: "Fail", message: "User not found" });
    }

    const userId = user._id;

    let userData = await USER_DATA_COLLECTION.findOne({ userId });

    if (userData && isToday(userData.updatedAt)) {
      return res.send({
        status: "Success",
        message: "facebook user data fetched from database.",
        userInfo: userData.facebook,
      });
    }

    const pageDetails = await getPageDetails(accessToken);
    if (!pageDetails)
      return res.send({ status: "Fail", message: "No pages found." });

    const pageData = await fetchPageDetails(
      pageDetails.id,
      pageDetails.access_token
    );

    const existingProfile = await USER_PROFILE_COLLECTION.findOne({ userId });

    if (!existingProfile) {
      const profile = new USER_PROFILE_COLLECTION({
        userId: userId,
        platform: CONSTANT.FACEBOOK,
        name: pageData?.data?.name || "Unknown",
        description: pageData?.data?.about || "No description available",
        category: pageData?.data?.category || "Uncategorized",
        profile_link: pageData?.data?.link || null,
        picture_url: pageData?.data?.picture?.data?.url || null,
        fan_count: pageData?.data?.fan_count || 0,
        follower_count: pageData?.data?.followers_count || 0,
      });

      await profile.save();
      console.log("Profile inserted successfully!");
    } else {
      console.log("Profile already exists. No insertion needed.");
    }

    const [postsData, followersData] = await Promise.all([
      getPagePosts(pageDetails.id, pageDetails.access_token),
      getPageFollowers(pageDetails.id, pageDetails.access_token),
    ]);

    const posts = postsData?.data || [];
    const userInfo = {
      post_count: posts.length,
      friends_count: followersData?.followers_count || 0,
    };

    if (!posts.length)
      return res.send({
        status: "Success",
        message: "No posts available.",
        userInfo,
        posts: [],
      });

    // Get all existing post IDs from the database
    const existingPosts = await USER_POST_COLLECTION.find(
      { post_id: { $in: posts.map((post) => post?.id) } },
      { post_id: 1 } // Only fetch the post_id field
    );

    const existingPostIds = new Set(existingPosts.map((post) => post.post_id)); // Convert to Set for fast lookup

    const newPostsDataArray = posts
      .filter((post) => post?.id && !existingPostIds.has(post.id)) // Exclude existing posts
      .map((post) => {
        return new USER_POST_COLLECTION({
          userId: userId,
          post_id: post.id,
          post_image_url: post.full_picture || null,
          post_url: post.permalink_url || null,
          post_title: post.message || "No Title",
          post_created_time: post.created_time || new Date().toISOString(),
          platform: CONSTANT.FACEBOOK,
          comment_count: post.comments?.summary?.total_count || 0,
          like_count: post.reactions?.summary?.total_count || 0,
          share_count: 0,
          view_count: 0,
        });
      });

    // Insert only new posts
    if (newPostsDataArray.length > 0) {
      await USER_POST_COLLECTION.insertMany(newPostsDataArray);
      console.log("New posts inserted successfully!");
    } else {
      console.log("No new posts to insert.");
    }

    const engagementStats = calculateEngagementStats(posts);
    
    const facebookData = {
      friends_count: userInfo.friends_count,
      totalReactions: engagementStats.totalReactions || 0,
      post_count: userInfo.post_count,
      totalComments: engagementStats.totalComments || 0,
    };

    if (!userData) {
      userData = new USER_DATA_COLLECTION({
        userId,
        facebook: facebookData,
      });
      await userData.save();
    } else {
      await USER_DATA_COLLECTION.updateOne(
        { userId },
        { facebook: facebookData, updatedAt: new Date() }
      );
    }

    return res.send({
      status: "Success",
      message: "User data and post details fetched successfully.",
      userInfo: { ...userInfo, ...engagementStats },
    });
  } catch (error) {
    console.error("Error fetching Facebook user data:", error);
    return res.status(500).send({
      status: "Fail",
      message: "An error occurred.",
      error: error.message,
    });
  }
}

async function _MonthlyPerformanceFacebookAnalytics(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken)
    return res
      .status(400)
      .send({ status: "Fail", message: "Missing access token" });

  try {

    // Get User ID using access token
    const user = await USER_COLLECTION.findOne({ accessToken });
    if (!user) {
      return res.status(404).send({
        status: "Fail",
        message: "User not found.",
      });
    }

    const userId = user._id;

    // Check if monthly performance data exists for the user
    let monthlyPerformance = await MONTHLY_PERFORMANCE_COLLECTION.findOne({
      userId,
    });

    // ✅ Case 2: Data exists & updated today → Return from DB
    if (monthlyPerformance && isToday(monthlyPerformance.updatedAt)) {
      return res.send({
        status: "Success",
        result: {
          message: "Analytics data fetched from database.",
          postCountArray: monthlyPerformance.monthlyPostCount,
          engagementRateArray: monthlyPerformance.monthlyEngagementRate,
          commentCountArray: monthlyPerformance.monthlyCommentCount,
        },
      });
    }

    const pageDetails = await getPageDetails(accessToken);
    if (!pageDetails)
      return res.send({ status: "Fail", message: "No pages found." });

    const [postsData, followersData] = await Promise.all([
      getPagePosts(pageDetails.id, pageDetails.access_token),
      getPageFollowers(pageDetails.id, pageDetails.access_token),
    ]);

    const posts = postsData?.data || [];
    const friendsCount = followersData?.followers_count || 0;
    if (!posts.length)
      return res.send({ status: "Success", message: "No posts available." });

    const engagementStats = calculateEngagementStats(posts);
    const engagementRatePerMonth = engagementStats.postCountPerMonth.map(
      (_, index) => {
        const totalEngagements =
          engagementStats.likeCountPerMonth[index] +
          engagementStats.commentCountPerMonth[index] +
          engagementStats.shareCountPerMonth[index];
        return friendsCount > 0 ? (totalEngagements / friendsCount) * 100 : 0;
      }
    );

    const analyticsData = {
      userId,
      monthlyPostCount: engagementStats.postCountPerMonth,
      monthlyEngagementRate: engagementRatePerMonth,
      monthlyCommentCount: engagementStats.commentCountPerMonth,
      updatedAt: new Date(),
    };

    if (!monthlyPerformance) {
      // ✅ Case 1: Create new data
      monthlyPerformance = new MONTHLY_PERFORMANCE_COLLECTION(analyticsData);
      await monthlyPerformance.save();
    } else {
      // ✅ Case 3: Update existing record
      await MONTHLY_PERFORMANCE_COLLECTION.updateOne(
        { userId },
        { $set: analyticsData }
      );
    }

    return res.send({
      status: "Success",
      result: {
        message: "Analytics processed successfully.",
        postCountArray: engagementStats.postCountPerMonth,
        engagementRateArray: engagementRatePerMonth,
        likeCountArray: engagementStats.likeCountPerMonth,
        commentCountArray: engagementStats.commentCountPerMonth,
        shareCountArray: engagementStats.shareCountPerMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching Facebook analytics data:", error);
    return res.status(500).send({
      status: "Fail",
      message: "An error occurred.",
      error: error.message,
    });
  }
}
