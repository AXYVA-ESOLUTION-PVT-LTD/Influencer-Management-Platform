const { validationResult } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const PUBLICATION_COLLECTION = require("../module/publication.module");
const USER_DATA_COLLECTION = require("../module/userData.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
const path = require("path");
const fs = require("fs");
const json = {};

const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET } = process.env;
exports.addPublication = _addPublication;
exports.getPublicationById = _getPublicationById;
exports.getPublications = _getPublications;
exports.removePublicationById = _removePublicationById;
exports.removeScreenshotById = _removeScreenshotById;
exports.updatePublicationById = _updatePublicationById;
exports.updatePublicationStatusById = _updatePublicationStatusById;

/*
TYPE: Post
TODO: Add new publication
*/
async function _addPublication(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      const screenshot = req.file;
      if (screenshot) {
        let filePath = path.join(
          __dirname,
          `../uploads/publication/${screenshot.filename}`
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, async () => {});
        }
      }
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    } else {
      const { opportunityId, type, publicationLink } = req.body;
      const { id, accessToken } = req.decoded;

      const existingUser = await USER_COLLECTION.findById(id);

      const objectId = existingUser._id;

      const userData = await USER_DATA_COLLECTION.findOne({ userId: objectId });

      if (!userData) {
        console.log("User data not found.");
      } else {
        console.log("User data found:", userData);
      }
      let Follower_count;
      if (existingUser.platform == CONSTANT.TIKTOK) {
        Follower_count = userData.tiktok.follower_count;
      } else if (existingUser.platform == CONSTANT.INSTAGRAM) {
        Follower_count = userData.instagram.followers_count;
      } else if (existingUser.platform == CONSTANT.FACEBOOK) {
        Follower_count = userData.facebook.friends_count;
      } else if (existingUser.platform == CONSTANT.YOUTUBE) {
        Follower_count = userData.youtube.totalSubscribers;
      }

      const screenshot = req.file;
      let videoStats = {}; 
     if(type !== "story") {
      if (existingUser.platform === CONSTANT.TIKTOK) {
        const videoId = getVideoIdFromUrl(publicationLink);
        videoStats = await tiktokVideoData(videoId, accessToken);
      } else if (existingUser.platform === CONSTANT.INSTAGRAM) {
        const videoId = extractInstagramPostId(publicationLink);
        videoStats = await getInstagramPostData(
          videoId,
          accessToken,
          existingUser.userId
        );
      } else if (existingUser.platform === CONSTANT.FACEBOOK) {
        const videoId = extractPostIdFromUrl(publicationLink);
        videoStats = await fetchFacebookPagePosts(videoId, accessToken);
      } else if (existingUser.platform === CONSTANT.YOUTUBE) {
        const targetVideoId = extractVideoId(publicationLink);
        videoStats = await getYoutubeData(targetVideoId, accessToken);
      }
    }
      const publicationObj = {
        influencerId: id,
        opportunityId: opportunityId,
        type: type,
        publicationLink: publicationLink,
      };

      if (screenshot) {
        publicationObj.screenshot = screenshot.filename;
      }

      publicationObj.followerCount = Follower_count || 0;
      publicationObj.likeCount = videoStats?.likes || 0;
      publicationObj.commentCount = videoStats?.comments || 0;
      publicationObj.shareCount = videoStats?.shares || 0;
      publicationObj.viewCount = videoStats?.views || 0;

      if (videoStats && videoStats.views > 0) {
        let engagementRate =
          ((videoStats.likes + videoStats.comments + videoStats.shares) /
            videoStats.views) *
          100;
        publicationObj.engagementRate = engagementRate
          ? +engagementRate.toFixed(2)
          : 0;
      } else {
        publicationObj.engagementRate = 0;
      }

      const publication = await PUBLICATION_COLLECTION.create(publicationObj);
      if (!publication) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Fail to create publication",
        };
        return res.send(json);
      } else {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Publication created successfully",
          data: {
            publication,
          },
        };
        return res.send(json);
      }
    }
  } catch (e) {
    const screenshot = req.file;
    if (screenshot) {
      let filePath = path.join(
        __dirname,
        `../uploads/publication/${screenshot.filename}`
      );
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async () => {});
      }
    }
    console.error(
      "Controller: publication | Method: _addPublication | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while add publication!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get publication by id
*/
async function _getPublicationById(req, res) {
  try {
    const id = req.params.id;
    const query = { _id: id, isDeleted: false };
    const existPublication = await PUBLICATION_COLLECTION.findOne(query)
      .populate({
        path: "influencerId",
        model: "User",
        select: ["username", "platform"],
      })
      .populate({
        path: "opportunityId",
        model: "Opportunity",
        select: ["title"],
      });
    if (!existPublication) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publication does not exists!",
        error: "Publication does not exists!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Publication found successfully!",
        data: existPublication,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _getPublicationById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while get publication!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all publications
*/
async function _getPublications(req, res) {
  try {
    const { id, roleId } = req.decoded;
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;
    var query = { isDeleted: false };
    const {
      influencer,
      platform,
      status,
      type,
      engagementRate,
      followerCount,
      likeCount,
      commentCount,
      shareCount,
      viewCount,
    } = req.body;

    if (
      !COMMON.isUndefinedOrNull(influencer) ||
      !COMMON.isUndefinedOrNull(platform)
    ) {
      var userQuery = {};
      if (!COMMON.isUndefinedOrNull(platform)) {
        var platformQuery = { platform: platform };
        userQuery = Object.assign({}, userQuery, platformQuery);
      }
      if (!COMMON.isUndefinedOrNull(influencer)) {
        var influencerQuery = {
          username: { $regex: `^${influencer}`, $options: "i" },
        };
        userQuery = Object.assign({}, userQuery, influencerQuery);
      }

      var users = await USER_COLLECTION.find(userQuery, { _id: 1 });

      if (COMMON.isArrayEmpty(users)) {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Publications found successfully!",
          data: [],
          totalRecords: totalRecords,
        };
        return res.send(json);
      } else {
        var influencerIds = users.map((a) => a._id);
        var influencerIdsQuery = { influencerId: { $in: influencerIds } };
        query = Object.assign({}, query, influencerIdsQuery);
      }
    }

    if (!COMMON.isUndefinedOrNull(status)) {
      var statusQuery = { status: status };
      query = Object.assign({}, query, statusQuery);
    }

    if (!COMMON.isUndefinedOrNull(type)) {
      var typeQuery = { type: type };
      query = Object.assign({}, query, typeQuery);
    }

    if (engagementRate > 0) {
      var engagementRateQuery = { engagementRate: { $lte: engagementRate } };
      query = Object.assign({}, query, engagementRateQuery);
    }

    if (followerCount > 0) {
      var followerCountQuery = { followerCount: { $lte: followerCount } };
      query = Object.assign({}, query, followerCountQuery);
    }

    if (likeCount > 0) {
      var likeCountQuery = { likeCount: { $lte: likeCount } };
      query = Object.assign({}, query, likeCountQuery);
    }

    if (commentCount > 0) {
      var commentCountQuery = { commentCount: { $lte: commentCount } };
      query = Object.assign({}, query, commentCountQuery);
    }

    if (shareCount > 0) {
      var shareCountQuery = { shareCount: { $lte: shareCount } };
      query = Object.assign({}, query, shareCountQuery);
    }

    if (viewCount > 0) {
      var viewCountQuery = { viewCount: { $lte: viewCount } };
      query = Object.assign({}, query, viewCountQuery);
    }

    if (roleId && roleId.name == "Influencer") {
      var influencerQuery = { influencerId: id };
      query = Object.assign({}, query, influencerQuery);
    }

    var totalRecords = await PUBLICATION_COLLECTION.countDocuments(query);
    var result = await PUBLICATION_COLLECTION.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "influencerId",
        model: "User",
        select: ["username", "platform"],
      })
      .populate({
        path: "opportunityId",
        model: "Opportunity",
        select: ["title"],
      });
    if (!result) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publications not found!",
        error: "Publications not found!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Publications found successfully!",
        data: result,
        totalRecords: totalRecords,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _getPublications | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while get publications!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Remove publication by id
*/
async function _removePublicationById(req, res) {
  try {
    const id = req.params.id;
    const query = { _id: id, isDeleted: false };
    const existPublication = await PUBLICATION_COLLECTION.findOne(query);
    if (!existPublication) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publication does not exists!",
        error: "Publication does not exists!",
      };
      return res.send(json);
    } else {
      PUBLICATION_COLLECTION.findByIdAndUpdate(id, { isDeleted: true })
        .then((result) => {
          json.status = CONSTANT.SUCCESS;
          json.result = {
            message: "Publication deleted successfully!",
            data: {},
          };
          return res.send(json);
        })
        .catch((error) => {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "An error occurred while delete publication!",
            error: error,
          };
          return res.send(json);
        });
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _removePublicationById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while delete publication!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Remove screenshot by id
*/
async function _removeScreenshotById(req, res) {
  try {
    const id = req.params.id;
    const query = { _id: id, isDeleted: false };
    const existPublication = await PUBLICATION_COLLECTION.findOne(query);
    if (!existPublication) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publication does not exists!",
        error: "Publication does not exists!",
      };
      return res.send(json);
    } else {
      const { screenshot } = req.body;
      let filePath = path.join(
        __dirname,
        `../uploads/publication/${screenshot}`
      );
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async (err) => {
          if (err) {
            json.status = CONSTANT.FAIL;
            json.result = {
              message:
                "An error occurred while removing publication screenshot",
              error: err,
            };
            return res.send(json);
          } else {
            var result = await PUBLICATION_COLLECTION.findByIdAndUpdate(id, {
              screenshot: "",
            });
            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "publication screenshot removed successfully",
              data: {},
            };
            return res.send(json);
          }
        });
      } else {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Publication screenshot not found",
          error: "Publication screenshot image not found",
        };
        return res.send(json);
      }
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _removeScreenshotById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while delete publication!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update publication by id
*/
async function _updatePublicationById(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      const screenshot = req.file;
      if (screenshot) {
        let filePath = path.join(
          __dirname,
          `../uploads/publication/${screenshot.filename}`
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, async () => {});
        }
      }
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    } else {
      const publicationId = req.params.id;
      const { opportunityId, type, publicationLink, status } = req.body;
      
      const { id, accessToken } = req.decoded;
      const screenshotImage = req.file;

      const query = { _id: publicationId, isDeleted: false };
      const existPublication = await PUBLICATION_COLLECTION.findOne(query);
      if (!existPublication) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Publication does not exists!",
          error: "Publication does not exists!",
        };
        return res.send(json);
      } else {
        const existingUser = await USER_COLLECTION.findById(id);
        
        const objectId = existingUser._id;

        const userData = await USER_DATA_COLLECTION.findOne({
          userId: objectId,
        });

        if (!userData) {
          console.log("User data not found.");
        } else {
          console.log("User data found:", userData);
        }
        let Follower_count;
        if (existingUser.platform == CONSTANT.TIKTOK) {
          Follower_count = userData.tiktok.follower_count;
        } else if (existingUser.platform == CONSTANT.INSTAGRAM) {
          Follower_count = userData.instagram.followers_count;
        } else if (existingUser.platform == CONSTANT.FACEBOOK) {
          Follower_count = userData.facebook.friends_count;
        } else if (existingUser.platform == CONSTANT.YOUTUBE) {
          Follower_count = userData.youtube.totalSubscribers;
        }

        const screenshot = req.file;
        let videoStats = {}; // Declare videoStats outside to avoid scoping issues

        if (existingUser.platform === CONSTANT.TIKTOK) {
          const videoId = getVideoIdFromUrl(publicationLink);
          videoStats = await tiktokVideoData(videoId, accessToken);
        } else if (existingUser.platform === CONSTANT.INSTAGRAM) {
          const videoId = extractInstagramPostId(publicationLink);
          videoStats = await getInstagramPostData(
            videoId,
            accessToken,
            existingUser.userId
          );
        } else if (existingUser.platform === CONSTANT.FACEBOOK) {
          const videoId = extractPostIdFromUrl(publicationLink);
          videoStats = await fetchFacebookPagePosts(videoId, accessToken);
        } else if (existingUser.platform === CONSTANT.YOUTUBE) {
          const targetVideoId = extractVideoId(publicationLink);
          videoStats = await getYoutubeData(targetVideoId, accessToken);
        }

        const publicationObj = {
          influencerId: id,
          opportunityId: opportunityId,
          type: type,
          publicationLink: publicationLink,
          status: status,
        };

        if (screenshotImage) {
          publicationObj.screenshot = screenshotImage.filename;
        }
        
        publicationObj.followerCount = Follower_count || 0;
        publicationObj.likeCount = videoStats?.likes || 0;
        publicationObj.commentCount = videoStats?.comments || 0;
        publicationObj.shareCount = videoStats?.shares || 0;
        publicationObj.viewCount = videoStats?.views || 0;

        if (videoStats && videoStats.views > 0) {
          let engagementRate =
            ((videoStats.likes + videoStats.comments + videoStats.shares) /
              videoStats.views) *
            100;
          publicationObj.engagementRate = engagementRate
            ? +engagementRate.toFixed(2)
            : 0;
        } else {
          publicationObj.engagementRate = 0;
        }

        const publication = await PUBLICATION_COLLECTION.findByIdAndUpdate(
          publicationId,
          publicationObj,
          { new: true }
        );
        if (!publication) {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "Fail to update publication",
          };
          return res.send(json);
        } else {
          json.status = CONSTANT.SUCCESS;
          json.result = {
            message: "Publication updated successfully",
            data: {
              publication,
            },
          };
          return res.send(json);
        }
      }
    }
  } catch (e) {
    const screenshot = req.file;
    if (screenshot) {
      let filePath = path.join(
        __dirname,
        `../uploads/publication/${screenshot.filename}`
      );
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async () => {});
      }
    }
    console.error(
      "Controller: publication | Method: _updatePublicationById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while update publication!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update publication status by id
*/
async function _updatePublicationStatusById(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const query = { _id: id, isDeleted: false };
    const existPublication = await PUBLICATION_COLLECTION.findOne(query);
    if (!existPublication) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Publication does not exists!",
        error: "Publication does not exists!",
      };
      return res.send(json);
    } else {
      PUBLICATION_COLLECTION.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      )
        .then((result) => {
          json.status = CONSTANT.SUCCESS;
          json.result = {
            message: "Publication status updated successfully!",
            data: result,
          };
          return res.send(json);
        })
        .catch((error) => {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "An error occurred while update publication status!",
            error: error,
          };
          return res.send(json);
        });
    }
  } catch (e) {
    console.error(
      "Controller: publication | Method: _updatePublicationStatusById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while update publication status!",
      error: e,
    };
    return res.send(json);
  }
}

function getVideoIdFromUrl(url) {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

async function tiktokVideoData(videoId, accessToken) {
  try {
    const fetch = (await import("node-fetch")).default;

    const videoInfoResponse = await fetch(
      `https://open.tiktokapis.com/v2/video/query/?fields=like_count,comment_count,share_count,view_count`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: {
            video_ids: [videoId],
          },
        }),
      }
    );

    const videoInfo = await videoInfoResponse.json();

    if (
      !videoInfo.data ||
      !videoInfo.data.videos ||
      videoInfo.data.videos.length === 0
    ) {
      throw new Error("Video details not found.");
    }

    return {
      likes: videoInfo?.data?.videos[0]?.like_count || 0,
      comments: videoInfo?.data?.videos[0]?.comment_count || 0,
      shares: videoInfo?.data?.videos[0]?.share_count || 0,
      views: videoInfo?.data?.videos[0]?.view_count || 0,
    };
  } catch (error) {
    console.error("Error fetching TikTok video data:", error.message);
    throw error;
  }
}

function extractInstagramPostId(url) {
  const match = url.match(/\/p\/(\w+)|\/reel\/(\w+)|\/stories\/[^/]+\/(\d+)/);
  return match ? match[1] || match[2] || match[3] : null;
}

async function getInstagramPostData(videoId, accessToken, userId) {
  const fetch = (await import("node-fetch")).default;

  try {
    // Fetch media posts data along with insights using Instagram Graph API
    const mediaUrl = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,timestamp,permalink,insights.metric(reach,likes,comments,saved,shares)&access_token=${accessToken}`;
    const mediaResponse = await fetch(mediaUrl, { method: "GET" });
    const mediaData = await mediaResponse.json();

    const matchedPost = mediaData.data.find(
      (post) => extractInstagramPostId(post.permalink) === videoId
    );
    if (!matchedPost) {
      console.error("No matching Instagram post found for the given URL.");
      return null;
    }

    const insights = matchedPost?.insights?.data.reduce((acc, metric) => {
      acc[metric.name] = metric.values[0].value;
      return acc;
    }, {});

    const postStats = {
      id: matchedPost.id,
      caption: matchedPost.caption || "",
      media_type: matchedPost.media_type,
      media_url: matchedPost.media_url,
      timestamp: matchedPost.timestamp,
      permalink: matchedPost.permalink,
      likes: insights?.likes || 0,
      comments: insights?.comments || 0,
      shares: insights?.shares || 0,
      views: insights?.reach || 0,
      saved: insights?.saved || 0,
    };

    return postStats;
  } catch (error) {
    console.error("Error fetching Instagram post data:", error.message);
    return null;
  }
}

function extractPostIdFromUrl(url) {
  try {
    // Handle different Facebook URL formats

    // Format: https://www.facebook.com/username/posts/postid
    const postsMatch = url.match(/facebook\.com\/[\w.]+\/posts\/(\d+)/);
    if (postsMatch) return postsMatch[1];

    // Format: https://www.facebook.com/permalink.php?story_fbid=postid&id=pageid
    const permalinkMatch = url.match(/story_fbid=(\d+)/);
    if (permalinkMatch) return permalinkMatch[1];

    // Format: https://www.facebook.com/pagename/videos/videoid
    const videoMatch = url.match(/facebook\.com\/[\w.]+\/videos\/(\d+)/);
    if (videoMatch) return videoMatch[1];

    // Format: https://www.facebook.com/photo.php?fbid=photoid
    const photoMatch = url.match(/fbid=(\d+)/);
    if (photoMatch) return photoMatch[1];

    // Format: https://www.facebook.com/pagename/photos/postid
    const photoPostMatch = url.match(
      /facebook\.com\/[\w.]+\/photos\/[a-z.]+\/(\d+)/
    );
    if (photoPostMatch) return photoPostMatch[1];

    // Format: https://www.facebook.com/username/reel/reelid
    const reelMatch = url.match(/facebook\.com\/[\w.]+\/reel\/(\d+)/);
    if (reelMatch) return reelMatch[1];

    // New format: https://www.facebook.com/reel/reelid
    const directReelMatch = url.match(/facebook\.com\/reel\/(\d+)/);
    if (directReelMatch) return directReelMatch[1];

    return null;
  } catch (error) {
    console.error("Error extracting post ID:", error);
    return null;
  }
}

const fetchFacebookPagePosts = async (videoId, accessToken) => {

  try {
    // Step 1: Get Page Details
    const pageResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,access_token&access_token=${accessToken}`
    );
    const pageData = await pageResponse.json();

    if (!pageData?.data?.length) {
      console.error("No Facebook page found.");
      return null;
    }

    const { id: pageId, access_token: pageAccessToken } = pageData.data[0];

    // Step 2: Fetch Posts with Pagination
    let allPosts = [];
    let nextPageUrl = `https://graph.facebook.com/v21.0/${pageId}/posts?fields=id,message,created_time,permalink_url,full_picture,shares,comments.summary(true),reactions.summary(true)&access_token=${pageAccessToken}`;

    while (nextPageUrl) {
      const response = await fetch(nextPageUrl);
      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error.message);
      }

      allPosts = [...allPosts, ...data.data];
      nextPageUrl = data.paging?.next || null;
    }

    const matchedPost = allPosts.find((post) => {
      const postId = extractPostIdFromUrl(post.permalink_url);
      return postId === videoId;
    });

    const stats = {
      id: matchedPost.id,
      caption: matchedPost.message || "",
      media_url: matchedPost.full_picture,
      timestamp: matchedPost.created_time,
      permalink: matchedPost.permalink_url,
      likes: matchedPost.reactions?.summary?.total_count || 0,
      comments: matchedPost.comments?.summary?.total_count || 0,
      shares: 0,
      views: 0,
      saved: 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    return null;
  }
};

const extractVideoId = (url) => {
  const match = url.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

const YOUTUBE_TOKEN_URL = "https://oauth2.googleapis.com/token";

async function getValidAccessToken(currentAccessToken) {
  try {
    const user = await USER_COLLECTION.findOne({
      accessToken: currentAccessToken,
    });

    if (!user) {
      throw new Error("User not found in USER_COLLECTION.");
    }

    const { accessToken, expiresIn, refreshToken } = user;

    const userId = user._id;

    // Check if the token is still valid
    if (expiresIn && Date.now() < Number(expiresIn)) {
      return { accessToken };
    }

    if (!refreshToken) {
      throw new Error(
        "Refresh token is missing. User needs to reauthenticate."
      );
    }

    console.log("Refreshing YouTube access token...");

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

    return { accessToken: access_token };
  } catch (error) {
    console.error("Error handling access token:", error.message);
    throw new Error("Failed to retrieve a valid access token.");
  }
}

async function getYoutubeData(targetVideoId, extractAccessToken) {

  const { accessToken } = await getValidAccessToken(extractAccessToken);

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

  // Fetch Channel Info
  const channelData = await fetchYouTubeAPI(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true"
  );

  if (!channelData.items || channelData.items.length === 0) {
    throw new Error("YouTube channel not found.");
  }

  const channel = channelData.items[0];

  let allVideos = [];
  let nextPageToken = "";

  // Fetch All Videos
  do {
    const videosData = await fetchYouTubeAPI(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&type=video&maxResults=50&pageToken=${nextPageToken}`
    );

    if (videosData.items) {
      allVideos.push(...videosData.items);
    }

    nextPageToken = videosData.nextPageToken || null;
  } while (nextPageToken);
  const targetVideo = allVideos.find(
    (video) => video.id.videoId === targetVideoId
  );

  let responseData = {
    channelName: channel.snippet.title,
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
  };

  if (!targetVideo) {
    console.log("Video not found in the list.");
    return responseData;
  }
  let stats;

  if (targetVideo) {
    // Fetch Like Count for the Target Video
    const videoStats = await fetchYouTubeAPI(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${targetVideoId}`
    );
  
    stats = videoStats.items?.[0]?.statistics || {};
    if (videoStats.items && videoStats.items.length > 0) {
      const likes = parseInt(
        videoStats.items[0].statistics.likeCount || "0",
        10
      );
      console.log(`Likes for Video ID ${targetVideoId}: ${likes}`);
    } else {
      console.log("No statistics found for this video.");
    }
  } else {
    console.log("Video not found in the list.");
  }

  let data = {
    channelName: channel.snippet.title,
    likes: parseInt(stats.likeCount || "0", 10),
    comments: parseInt(stats.commentCount || "0", 10),
    shares: 0,
    views: parseInt(stats.viewCount || "0", 10),
  };

  return data;
}
