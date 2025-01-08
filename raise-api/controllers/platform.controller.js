const COMMON = require("../config/common.js");
const json = {};
const USER_COLLECTION = require("../module/user.module.js");
const CONSTANT = require("../config/constant.js");
const axios = require('axios');

exports.YouTubeData = _YouTubeData;
exports.InstagramData = _InstagramData;
exports.TikTokData = _TikTokData;


// Youtube api
async function _YouTubeData(req, res) {
    const json = {};
    try {
        const { username } = req.body;
        if (!username) {
            json.status = CONSTANT.FAIL;
            json.result = { error: "Username is required" };
            return res.send(json);
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forUsername=${username}&key=${apiKey}`
        );

        if (response.data.items.length === 0) {
            json.status = CONSTANT.FAIL;
            json.result = { error: "User not found" };
            return res.send(json);
        }

        const data = response.data.items[0];
        json.status = CONSTANT.SUCCESS;
        json.result = {
            message: "YouTube data fetched successfully!",
            data: {
                id: data.id,
                name: data.snippet.title,
                views: data.statistics.viewCount,
                subscribers: data.statistics.subscriberCount,
                videos: data.statistics.videoCount,
            },
        };
        return res.send(json);
    } catch (error) {
        json.status = CONSTANT.FAIL;
        json.result = { error: "Failed to fetch YouTube data", details: error.message };
        return res.send(json);
    }
}

// Instagram api call
async function _InstagramData(req, res) {
    const json = {};
    try {
        const { username } = req.body;
        if (!username) {
            json.status = CONSTANT.FAIL;
            json.result = { error: "Username is required" };
            return res.send(json);
        }

        const token = process.env.INSTAGRAM_ACCESS_TOKEN;
        const response = await axios.get(
            `https://graph.facebook.com/v16.0/${username}?fields=id,username,followers_count,media_count&access_token=${token}`
        );

        json.status = CONSTANT.SUCCESS;
        json.result = {
            message: "Instagram data fetched successfully!",
            data: response.data,
        };
        return res.send(json);
    } catch (error) {
        json.status = CONSTANT.FAIL;
        json.result = { error: "Failed to fetch Instagram data", details: error.message };
        return res.send(json);
    }
}

// Tiktok API
async function _TikTokData(req, res) {
    const json = {};
    try {
        const { username } = req.body;
        if (!username) {
            json.status = CONSTANT.FAIL;
            json.result = { error: "Username is required" };
            return res.send(json);
        }

        const apiKey = process.env.TIKTOK_API_KEY;
        const response = await axios.get(
            `https://tiktok-scraper2.p.rapidapi.com/user/info?username=${username}`,
            {
                headers: {
                    "X-RapidAPI-Key": apiKey,
                },
            }
        );

        json.status = CONSTANT.SUCCESS;
        json.result = {
            message: "TikTok data fetched successfully!",
            data: response.data,
        };
        return res.send(json);
    } catch (error) {
        json.status = CONSTANT.FAIL;
        json.result = { error: "Failed to fetch TikTok data", details: error.message };
        return res.send(json);
    }
}
