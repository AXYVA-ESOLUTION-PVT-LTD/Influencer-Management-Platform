const json = {};
require("dotenv").config();
const CronJob = require("cron").CronJob;
const USER_COLLECTION = require("../module/user.module");
const qs = require("qs");

class eventCron {
  instagramAccessTokenUpdateCron() {
    var job = new CronJob("0 5 * * *", async function () {
      console.log("🚀 Instagram access token renewal cron running at 5 AM daily...");

      try {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
        const twoDaysAfterTimestamp = currentTimestamp + 2 * 24 * 60 * 60; // 2 days later

        const userData = await USER_COLLECTION.find(
          {
            expiresIn: { $gte: currentTimestamp, $lte: twoDaysAfterTimestamp },
            platform: "Instagram",
          },
          { _id: 1, refreshToken: 1 }
        );

        console.log("📝 Users needing token refresh:", userData.length);

        if (userData.length > 0) {
          for (const element of userData) {
            console.log("🔄 Refreshing token for user:", element._id);

            const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${element.refreshToken}`;

            try {
              const refreshResponse = await fetch(refreshUrl, { method: "GET" });
              const exchangeData = await refreshResponse.json();

              if (exchangeData.error) {
                console.error("❌ Token refresh failed for user:", element._id, exchangeData.error);
                continue;
              }

              // Calculate new expiry timestamp in seconds
              const newTokenExpiresAt = Math.floor(Date.now() / 1000) + exchangeData.expires_in;

              // Update user data in DB
              await USER_COLLECTION.findByIdAndUpdate(element._id, {
                $set: {
                  accessToken: exchangeData.access_token,
                  refreshToken: exchangeData.access_token, // Refresh token is same as access token
                  expiresIn: newTokenExpiresAt,
                },
              });

              console.log("✅ Token updated successfully for user:", element._id);
            } catch (error) {
              console.error("⚠️ Error during fetch request:", error);
            }
          }

          console.log("🎉 All eligible Instagram access tokens updated.");
        } else {
          console.log("⏳ No tokens needed renewal.");
        }
      } catch (error) {
        console.error("❌ Error in cron job execution:", error);
      }
    });

    job.start();
  }

  facebookAccessTokenUpdateCron() {
    var job = new CronJob("0 6 * * *", async function () {
      console.log("🚀 Facebook access token renewal cron running at 6 AM daily...");
  
      try {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        const twoDaysAfterTimestamp = currentTimestamp + 2 * 24 * 60 * 60; // 2 days later
  
        const userData = await USER_COLLECTION.find(
          {
            expiresIn: { $gte: currentTimestamp, $lte: twoDaysAfterTimestamp },
            platform: "Facebook",
          },
          { _id: 1, accessToken: 1 }
        );

        console.log("📝 Users needing token refresh:", userData.length);
  
        if (userData.length > 0) {
          for (const user of userData) {
            console.log("🔄 Refreshing token for user:", user._id);
  
            const refreshURL = "https://graph.facebook.com/v19.0/oauth/access_token";
            const params = {
              grant_type: "fb_exchange_token",
              client_id: process.env.FACEBOOK_APP_ID,
              client_secret: process.env.FACEBOOK_APP_SECRET,
              fb_exchange_token: user.accessToken,
            };
  
            const queryString = qs.stringify(params);
            const requestUrl = `${refreshURL}?${queryString}`;
  
            try {
              const response = await fetch(requestUrl, { method: "GET" });
              const data = await response.json();
  
              if (data.error) {
                console.error("❌ Token refresh failed for user:", user._id, data.error);
                continue;
              }
              
              console.log("new token data : ",JSON.stringify(data));

              // Calculate new expiry timestamp in seconds
              const newTokenExpiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
  
              // Update user data in DB
              await USER_COLLECTION.findByIdAndUpdate(user._id, {
                $set: {
                  accessToken: data.access_token,
                  expiresIn: newTokenExpiresAt,
                },
              });
  
              console.log("✅ Token updated successfully for user:", user._id);
            } catch (error) {
              console.error("⚠️ Error during fetch request:", error);
            }
          }
  
          console.log("🎉 All eligible Facebook access tokens updated.");
        } else {
          console.log("⏳ No tokens needed renewal.");
        }
      } catch (error) {
        console.error("❌ Error in cron job execution:", error);
      }
    });
  
    job.start();
  }

}

module.exports = new eventCron();
