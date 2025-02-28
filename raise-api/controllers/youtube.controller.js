require("dotenv").config();
const jwt = require("jsonwebtoken");
// const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const USER_COLLECTION = require("../module/user.module");
const USER_DATA_COLLECTION = require("../module/userData.module");
const AUDIENCE_INSIGHT = require("../module/audienceInsight.module");
const MONTHLY_PERFORMANCE_COLLECTION = require("../module/monthlyPerformance.module");
const CONSTANT = require("../config/constant");

const {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI,
  FRONTEND_URL,
  superSecret,
} = process.env;

exports.youtubeAuth = _youtubeAuth;
exports.youtubeAuthCallback = _youtubeAuthCallback;
exports.getYouTubeAnalytics = _getYouTubeAnalytics;
exports.fetchYouTubeChannelStats = _fetchYouTubeChannelStats;
exports.getYouTubeDemographics = _getYouTubeDemographics;

async function _youtubeAuth(req, res) {
  try {
    const state = req.params.token || "default_state";
    const params = new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      redirect_uri: YOUTUBE_REDIRECT_URI,
      response_type: "code",
      scope: [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/yt-analytics.readonly",
      ].join(" "),
      access_type: "offline",
      prompt: "consent",
      state,
    });

    const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;

    res.redirect(authUrl);
  } catch (error) {
    res.status(500).json({
      message: "Error generating Google OAuth URL",
      error: error.message,
    });
  }
}

const extractToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Unauthorized: Access Token required");
  return token;
};

const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";

async function _youtubeAuthCallback(req, res) {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Missing 'code' parameter in query" });
    }

    const fetch = (await import("node-fetch")).default;

    const params = new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: YOUTUBE_REDIRECT_URI,
    });

    let response;
    try {
      response = await fetch(YOUTUBE_TOKEN_URL, {
        method: "POST",
        body: params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch (networkError) {
      console.error(
        "Network error while fetching YouTube token:",
        networkError
      );
      return res
        .status(502)
        .json({ message: "Failed to reach YouTube token server" });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("YouTube Token API Error:", errorData);
      return res.status(response.status).json({
        message: "Failed to fetch access token",
        error: errorData,
      });
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error("Error parsing YouTube token response:", jsonError);
      return res
        .status(500)
        .json({ message: "Invalid response from YouTube API" });
    }

    const {
      access_token,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = responseData;
    const expirationTimestamp = Date.now() + expires_in * 1000;
    const refreshTokenExpirationTimestamp =
      Date.now() + refresh_token_expires_in * 1000;

    let channelResponse;
    try {
      channelResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
    } catch (networkError) {
      console.error(
        "Network error while fetching YouTube channel data:",
        networkError
      );
      return res.status(502).json({ message: "Failed to reach YouTube API" });
    }

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      console.error("YouTube Channel API Error:", errorText);
      return res.status(channelResponse.status).json({
        message: "Failed to fetch channel data",
        error: errorText,
      });
    }

    let channelData;
    try {
      channelData = await channelResponse.json();
    } catch (jsonError) {
      console.error("Error parsing YouTube channel response:", jsonError);
      return res
        .status(500)
        .json({ message: "Invalid response from YouTube API" });
    }

    const channelInfo = channelData.items?.[0];
    if (!channelInfo) {
      return res
        .status(404)
        .json({ message: "No channel data found for user" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(state, process.env.superSecret);
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError);
      return res.status(401).json({ message: "Invalid state parameter" });
    }

    const user_Id = decodedToken.id;

    const existingUsername = await USER_COLLECTION.findOne({
      username: channelInfo.snippet.title,
      platform: CONSTANT.YOUTUBE,
    });

    if (existingUsername) {
      const currentTime = Date.now();
      const refreshTokenExpireIn = Number(
        existingUsername.refreshTokenExpireIn
      );

      if (refreshTokenExpireIn && currentTime < refreshTokenExpireIn) {
        return res.redirect(
          `${FRONTEND_URL}/onboarding?message=User%20already%20logged%20in`
        );
      }
    }

    const existingUser = await USER_COLLECTION.findById(user_Id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.username = channelInfo.snippet.title;
    existingUser.platform = CONSTANT.YOUTUBE;
    existingUser.isVerified = true;
    existingUser.accessToken = access_token;
    existingUser.refreshToken = refresh_token;
    existingUser.status = true;
    existingUser.expiresIn = expirationTimestamp;
    existingUser.refreshTokenExpireIn = refreshTokenExpirationTimestamp;

    await existingUser.save();

    const userObj = {
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

    return res.redirect(`${FRONTEND_URL}/login/callback?data=${encodedData}`);
  } catch (error) {
    console.error("YouTube Auth Callback Error:", error);

    let statusCode = 500;
    if (error.message.includes("Missing 'code' parameter")) statusCode = 400;
    else if (error.message.includes("Invalid state parameter"))
      statusCode = 401;
    else if (error.message.includes("No channel data found")) statusCode = 404;
    else if (error.message.includes("User not found")) statusCode = 404;

    res.status(statusCode).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
}

async function getValidAccessToken(accessToken) {
  const oldAccessToken = accessToken;
  try {
    const user = await USER_COLLECTION.findOne({ accessToken: oldAccessToken });

    if (!user) {
      throw new Error("User not found in USER_COLLECTION.");
    }

    const { accessToken, expiresIn, refreshToken } = user;
    
    const userId = user._id;

    if (Date.now() < Number(expiresIn)) {
      return { accessToken, userId };
    }

    if (!refreshToken) {
      throw new Error(
        "Refresh token is missing. User needs to reauthenticate."
      );
    }

    const params = new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const response = await fetch(YOUTUBE_TOKEN_URL, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to refresh access token: ${errorData.error}`);
    }

    const responseData = await response.json();

    const { access_token, expires_in } = responseData;
    const expirationTimestamp = Date.now() + expires_in * 1000;

    await USER_COLLECTION.updateOne(
      { _id: userId },
      {
        $set: {
          accessToken: access_token,
          expiresIn: expirationTimestamp,
        },
      }
    );

    return { accessToken, userId };
  } catch (error) {
    console.error("Error handling access token:", error.message);
    throw new Error("Failed to retrieve a valid access token.");
  }
}

async function _fetchYouTubeChannelStats(req, res) {
  try {
    const extractAccessToken = extractToken(req);
    const { accessToken, userId } = await getValidAccessToken(
      extractAccessToken
    );

    let userData = await USER_DATA_COLLECTION.findOne({ userId });

    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    if (userData && isToday(userData.updatedAt)) {
      return res.json({
        status: CONSTANT.SUCCESS,
        result: {
          message: "YouTube channel statistics fetched from database",
          data: userData.youtube,
        },
      });
    }

    const fetchYouTubeAPI = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `YouTube API Error: ${errorData.error?.message || "Unknown error"}`
        );
      }
      return response.json();
    };

    const channelData = await fetchYouTubeAPI(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true"
    );

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("YouTube channel not found.");
    }

    const channel = channelData.items[0];
    const totalSubscribers = channel.statistics.subscriberCount || 0;
    const totalVideos = channel.statistics.videoCount || 0;

    const playlistsData = await fetchYouTubeAPI(
      `https://www.googleapis.com/youtube/v3/playlists?part=id&channelId=${channel.id}&maxResults=50`
    );
    const totalPlaylists = playlistsData.items ? playlistsData.items.length : 0;

    let totalLikes = 0;
    let nextPageToken = "";

    do {
      const videosData = await fetchYouTubeAPI(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&type=video&maxResults=50&pageToken=${nextPageToken}`
      );

      nextPageToken = videosData.nextPageToken || "";

      const videoIds = videosData.items
        .map((video) => video.id.videoId)
        .filter(Boolean) 
        .join(",");

      if (videoIds) {
        const statsData = await fetchYouTubeAPI(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`
        );

        totalLikes += statsData.items.reduce(
          (sum, vid) => sum + parseInt(vid.statistics.likeCount || 0, 10),
          0
        );
      }
    } while (nextPageToken);

    const youtubeData = {
      totalSubscribers,
      totalVideos,
      totalPlaylists,
      totalLikes,
    };

    await USER_DATA_COLLECTION.findOneAndUpdate(
      { userId },
      { youtube: youtubeData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    return res.json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "YouTube channel statistics fetched successfully",
        data: youtubeData,
      },
    });
  } catch (error) {
    console.error("YouTube Channel Stats Fetch Error:", error.message);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Failed to fetch YouTube channel statistics",
        error: error.message,
      },
    });
  }
}

async function _getYouTubeAnalytics(req, res) {
  try {
    const extractAccessToken = extractToken(req);
    const { accessToken, userId } = await getValidAccessToken(
      extractAccessToken
    );

    const today = new Date().toISOString().split("T")[0]; 

    const existingRecord = await MONTHLY_PERFORMANCE_COLLECTION.findOne({ userId });

    if (existingRecord) {
      const updatedAt = existingRecord.updatedAt?.toISOString().split("T")[0] || null;

      if (updatedAt === today) {
        return res.json({
          status: "Success",
          result: {
            message: "Fetched cached YouTube analytics",
            data: {
              postCountArray: existingRecord.monthlyPostCount,
              commentCountArray: existingRecord.monthlyCommentCount,
              engagementRateArray: existingRecord.monthlyEngagementRate,
            },
          },
        });
      }
    }

    const getMonthYear = (timestamp) => {
      const date = new Date(timestamp);
      return { month: date.getMonth(), year: date.getFullYear() };
    };

    let postCountPerMonth = Array(12).fill(0);
    let engagementRatePerMonth = Array(12).fill(0);
    let commentCountPerMonth = Array(12).fill(0);
    let likeCountPerMonth = Array(12).fill(0);
    let viewCountPerMonth = Array(12).fill(0);
  
    async function fetchYouTubeAPI(url, accessToken) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error?.message || "Unknown error";

          if (response.status === 401)
            throw new Error("Unauthorized: Invalid or expired token.");
          if (response.status === 403)
            throw new Error("Forbidden: Insufficient permissions.");
          if (response.status === 404) throw new Error("Resource not found.");
          if (response.status === 429)
            throw new Error("Rate limit exceeded. Try again later.");

          throw new Error(`YouTube API Error: ${errorMessage}`);
        }

        return await response.json();
      } catch (error) {
        throw new Error(`YouTube API Request Failed: ${error.message}`);
      }
    }

    const channelData = await fetchYouTubeAPI(
      "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
      accessToken
    );

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("YouTube channel not found.");
    }

    const channelId = channelData.items[0].id;

    const videosApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=50&order=date`;
    const videosData = await fetchYouTubeAPI(videosApiUrl, accessToken);

    if (!videosData.items || videosData.items.length === 0) {
      throw new Error("No videos found for this channel.");
    }

    const videoIds = videosData.items
      .map((video) => video.id.videoId)
      .filter(Boolean)
      .join(",");

    if (!videoIds) {
      throw new Error("Failed to extract video IDs.");
    }

    const statsApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`;
    const statsData = await fetchYouTubeAPI(statsApiUrl, accessToken);

    if (!statsData.items || statsData.items.length === 0) {
      throw new Error("No video statistics found.");
    }

    const statsMap = statsData.items.reduce((acc, video) => {
      acc[video.id] = video.statistics;
      return acc;
    }, {});

    const currentYear = new Date().getFullYear();

    videosData.items.forEach((video) => {
      const { month, year } = getMonthYear(video.snippet.publishedAt);
      if (year === currentYear) {
        postCountPerMonth[month]++;
        commentCountPerMonth[month] += parseInt(
          statsMap[video.id.videoId]?.commentCount || 0
        );
        likeCountPerMonth[month] += parseInt(
          statsMap[video.id.videoId]?.likeCount || 0
        );
        viewCountPerMonth[month] += parseInt(
          statsMap[video.id.videoId]?.viewCount || 0
        );
      }
    });

    engagementRatePerMonth = engagementRatePerMonth.map((_, index) => {
      const views = viewCountPerMonth[index];
      if (views > 0) {
        return (
          ((likeCountPerMonth[index] + commentCountPerMonth[index]) / views) *
          100
        );
      }
      return 0;
    });

    const analyticsData = {
      userId,
      monthlyPostCount: postCountPerMonth,
      monthlyEngagementRate: engagementRatePerMonth,
      monthlyCommentCount: commentCountPerMonth,
    };

    if (existingRecord) {
      await MONTHLY_PERFORMANCE_COLLECTION.updateOne({ userId }, analyticsData);
    } else {
      await MONTHLY_PERFORMANCE_COLLECTION.create(analyticsData);
    }

    const responseData = {
      postCountArray: postCountPerMonth,
      engagementRateArray: engagementRatePerMonth,
      commentCountArray: commentCountPerMonth,
    }

    return res.json({
      status: "Success",
      result: {
        message: "YouTube analytics processed successfully",
        data: responseData,
      },
    });
  } catch (error) {
    console.error("YouTube Analytics Fetch Error:", error.message);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Failed to fetch YouTube analytics",
        error: error.message,
      },
    });
  }
}

async function _getYouTubeDemographics(req, res) {
  try {
    const extractAccessToken = extractToken(req);
    const { accessToken, userId } = await getValidAccessToken(
      extractAccessToken
    );

    const today = new Date().toISOString().split("T")[0]; 

    const existingData = await AUDIENCE_INSIGHT.findOne({
      userId,
      updatedAt: { $gte: new Date(today) }, 
    });

    if (existingData) {
      return res.json({
        status: CONSTANT.SUCCESS,
        result: {
          message: "Returning cached YouTube demographic insights",
          data: existingData,
        },
      });
    }

    async function fetchYouTubeAPI(url, accessToken) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error?.message || "Unknown error";

          if (response.status === 401)
            throw new Error("Unauthorized: Invalid or expired token.");
          if (response.status === 403)
            throw new Error("Forbidden: Insufficient permissions.");
          if (response.status === 404) throw new Error("Resource not found.");
          if (response.status === 429)
            throw new Error("Rate limit exceeded. Try again later.");

          throw new Error(`YouTube API Error: ${errorMessage}`);
        }

        return await response.json();
      } catch (error) {
        throw new Error(`YouTube API Request Failed: ${error.message}`);
      }
    }

    const channelData = await fetchYouTubeAPI(
      "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
      accessToken
    );

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("YouTube channel not found.");
    }

    const channelId = channelData.items[0].id;

    const ageUrl =
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      new URLSearchParams({
        ids: `channel==${channelId}`,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        metrics: "viewerPercentage",
        dimensions: "ageGroup",
        sort: "ageGroup",
      });

    const ageData = await fetchYouTubeAPI(ageUrl, accessToken);
    const ageDemographics = ageData.rows || [];

    const genderUrl =
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      new URLSearchParams({
        ids: `channel==${channelId}`,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        metrics: "viewerPercentage",
        dimensions: "gender",
        sort: "gender",
      });

    const genderData = await fetchYouTubeAPI(genderUrl, accessToken);
    const genderDemographics = genderData.rows || [];

    const countryUrl =
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      new URLSearchParams({
        ids: `channel==${channelId}`,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        metrics: "views",
        dimensions: "country",
        sort: "views",
      });

    const countryData = await fetchYouTubeAPI(countryUrl, accessToken);
    const countryViews = countryData.rows || [];

    const totalViews = countryViews.reduce(
      (sum, country) => sum + country[1],
      0
    );

    const pieChartAgeData = ageDemographics.map(([ageRange, percentage]) => ({
      name: ageRange,
      y: parseFloat(percentage.toFixed(2)),
    }));

    const pieChartGenderData = genderDemographics.map(
      ([gender, percentage]) => ({
        name: gender,
        y: parseFloat(percentage.toFixed(2)),
      })
    );

    const pieChartCountryData = countryViews.map(([country, views]) => ({
      name: country,
      y: parseFloat(
        totalViews > 0 ? ((views / totalViews) * 100).toFixed(2) : "0.00"
      ),
    }));

    await AUDIENCE_INSIGHT.findOneAndUpdate(
      { userId },
      {
        $set: {
          ageDemographics: pieChartAgeData,
          genderDemographics: pieChartGenderData,
          countryViews: pieChartCountryData,
          updatedAt: new Date(), 
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      status: CONSTANT.SUCCESS,
      result: {
        message: "YouTube demographic insights fetched successfully",
        data: {
          channelId,
          ageDemographics: pieChartAgeData,
          genderDemographics: pieChartGenderData,
          countryViews: pieChartCountryData,
        },
      },
    });
  } catch (error) {
    console.error("YouTube Demographics Fetch Error:", error.message);
    return res.status(500).json({
      status: CONSTANT.FAIL,
      result: {
        message: "Failed to fetch YouTube demographic insights",
        error: error.message,
      },
    });
  }
}
