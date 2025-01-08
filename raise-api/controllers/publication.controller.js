const { validationResult } = require("express-validator");
const USER_COLLECTION = require("../module/user.module");
const PUBLICATION_COLLECTION = require("../module/publication.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
const path = require('path');
const fs = require("fs");
const json = {};

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
        let filePath = path.join(__dirname, `../uploads/publication/${screenshot.filename}`);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, async () => {})
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
      const videoId = getVideoIdFromUrl(publicationLink);
      const screenshot = req.file;
  
      const { userStats, videoStats } = await getVideoAndUserDetails(videoId, accessToken);
  
      const publicationObj = {
        influencerId: id,
        opportunityId: opportunityId,
        type: type,
        publicationLink: publicationLink,
      };
  
      if (screenshot) {
        publicationObj.screenshot = screenshot.filename;
      }
  
      publicationObj.followerCount = userStats.followers || 0;
      publicationObj.likeCount = videoStats.likes || 0;
      publicationObj.commentCount = videoStats.comments || 0;
      publicationObj.shareCount = videoStats.shares || 0;
      publicationObj.viewCount = videoStats.views || 0;
      
      if(videoStats && videoStats.views > 0){
        let engagementRate = ((videoStats.likes + videoStats.comments + videoStats.shares) / videoStats.views) * 100;
        publicationObj.engagementRate = engagementRate ? +engagementRate.toFixed(2) : 0;
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
      let filePath = path.join(__dirname, `../uploads/publication/${screenshot.filename}`);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async () => {})
      }
    }
    console.error("Controller: publication | Method: _addPublication | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while add publication!", error: e };
    return res.send(json);
  }
}

async function getVideoAndUserDetails(videoId, accessToken) {
  try {
    const [userStats, videoStats] = await Promise.all([
      getUserDetail(accessToken),
      getVideoDetail(videoId, accessToken),
    ]);

    return { userStats, videoStats };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function getUserDetail(accessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch = (await import("node-fetch")).default;
      const userInfoResponse = await fetch(
        `https://open-api.tiktok.com/v2/user/info/?fields=follower_count`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userInfo = await userInfoResponse.json();
      if (!userInfo.data) {
        return reject(new Error('User details not found.'));
      }

      const userStats = {
        followers: userInfo?.data?.user?.follower_count || 0,
      };

      resolve(userStats);
    } catch (error) {
      reject(error);
    }
  });
}1

async function getVideoDetail(videoId, accessToken) {
  return new Promise(async (resolve, reject) => {
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
            "filters": {
              "video_ids": [`${videoId}`]
            }
          }),
        }
      );
      const videoInfo = await videoInfoResponse.json();

      if (!videoInfo.data) {
        return reject(new Error('Video details not found.'));
      }

      const videoStats = {
        likes: videoInfo?.data?.videos[0]?.like_count || 0,
        comments: videoInfo?.data?.videos[0]?.comment_count || 0,
        shares: videoInfo?.data?.videos[0]?.share_count || 0,
        views: videoInfo?.data?.videos[0]?.view_count || 0,
      };

      resolve(videoStats);
    } catch (error) {
      reject(error);
    }
  });
}

function getVideoIdFromUrl(url) {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
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
      json.result = { message: "Publication found successfully!", data: existPublication };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: publication | Method: _getPublicationById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get publication!", error: e };
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
    const { influencer, platform, status, type ,engagementRate ,followerCount ,likeCount, commentCount, shareCount, viewCount } = req.body;

    if(!COMMON.isUndefinedOrNull(influencer) || !COMMON.isUndefinedOrNull(platform)){
      var userQuery = {};
      if(!COMMON.isUndefinedOrNull(platform)){
        var platformQuery = { platform: platform };
        userQuery = Object.assign({}, userQuery, platformQuery);
      }
      if(!COMMON.isUndefinedOrNull(influencer)){
        var influencerQuery = { username: { $regex: `^${influencer}`, $options: "i" } };
        userQuery = Object.assign({}, userQuery, influencerQuery);
      }
  

      var users = await USER_COLLECTION.find(userQuery, {_id: 1});
  
      if(COMMON.isArrayEmpty(users)){
        json.status = CONSTANT.SUCCESS;
        json.result = { 
          message: "Publications found successfully!",
          data: [],
          totalRecords: totalRecords,
        };
        return res.send(json); 
      } else {
        var influencerIds = users.map(a => a._id);
        var influencerIdsQuery = { influencerId: { $in : influencerIds } };
        query = Object.assign({}, query, influencerIdsQuery);
      }

    }

    if(!COMMON.isUndefinedOrNull(status)){
      var statusQuery = { status: status };
      query = Object.assign({}, query, statusQuery);
    }

    if(!COMMON.isUndefinedOrNull(type)){
      var typeQuery = { type: type };
      query = Object.assign({}, query, typeQuery);
    }

    if(engagementRate > 0){
      var engagementRateQuery = { engagementRate: { $lte: engagementRate } };
      query = Object.assign({}, query, engagementRateQuery);
    }

    if(followerCount > 0){
      var followerCountQuery = { followerCount: { $lte: followerCount } };
      query = Object.assign({}, query, followerCountQuery);
    }

    if(likeCount > 0){
      var likeCountQuery = { likeCount: { $lte: likeCount } };
      query = Object.assign({}, query, likeCountQuery);
    }

    if(commentCount > 0){
      var commentCountQuery = { commentCount: { $lte: commentCount } };
      query = Object.assign({}, query, commentCountQuery);
    }

    if(shareCount > 0){
      var shareCountQuery = { shareCount: { $lte: shareCount } };
      query = Object.assign({}, query, shareCountQuery);
    }
    
    if(viewCount > 0){
      var viewCountQuery = { viewCount: { $lte: viewCount } };
      query = Object.assign({}, query, viewCountQuery);
    }

    if(roleId && roleId.name == "Influencer"){
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
      json.result = { message: "Publications not found!", error: "Publications not found!" };
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
    console.error("Controller: publication | Method: _getPublications | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get publications!", error: e };
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
          json.result = { message: "Publication deleted successfully!", data: {} };
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
    console.error("Controller: publication | Method: _removePublicationById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete publication!", error: e };
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
      let filePath = path.join(__dirname, `../uploads/publication/${screenshot}`);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async (err) => {
          if (err) {
            json.status = CONSTANT.FAIL;
            json.result = {
              message: "An error occurred while removing publication screenshot",
              error: err,
            };
            return res.send(json);
          } else {
            var result = await PUBLICATION_COLLECTION.findByIdAndUpdate(id, { screenshot: "" })
            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "publication screenshot removed successfully",
              data: {},
            };
            return res.send(json);
          }
        })
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
    console.error("Controller: publication | Method: _removeScreenshotById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete publication!", error: e };
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
        let filePath = path.join(__dirname, `../uploads/publication/${screenshot.filename}`);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, async () => {})
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
      const { opportunityId, type, publicationLink ,status } = req.body;
      const { id, accessToken } = req.decoded;
      const videoId = getVideoIdFromUrl(publicationLink);
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
        const { userStats, videoStats } = await getVideoAndUserDetails(videoId, accessToken);
        const publicationObj = {
          influencerId: id,
          opportunityId: opportunityId,
          type: type,
          publicationLink: publicationLink,
          status : status
        };
    
        if (screenshotImage) {
          publicationObj.screenshot = screenshotImage.filename;
        }
    
        publicationObj.followerCount = userStats.followers || 0;
        
        if(videoStats && videoStats.views > 0){
          let engagementRate = ((videoStats.likes + videoStats.comments + videoStats.shares) / videoStats.views) * 100;
          publicationObj.engagementRate = engagementRate ? +engagementRate.toFixed(2) : 0;
        } else {
          publicationObj.engagementRate = 0;
        }
    
        const publication = await PUBLICATION_COLLECTION.findByIdAndUpdate(publicationId, publicationObj, { new: true});
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
      let filePath = path.join(__dirname, `../uploads/publication/${screenshot.filename}`);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async () => {})
      }
    }
    console.error("Controller: publication | Method: _updatePublicationById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update publication!", error: e };
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
      PUBLICATION_COLLECTION.findByIdAndUpdate(id, { status: status }, { new: true })
        .then((result) => {
          json.status = CONSTANT.SUCCESS;
          json.result = { message: "Publication status updated successfully!", data: result };
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
    console.error("Controller: publication | Method: _updatePublicationStatusById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update publication status!", error: e };
    return res.send(json);
  }
}