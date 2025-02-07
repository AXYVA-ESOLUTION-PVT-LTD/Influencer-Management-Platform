const json = {};
require("dotenv").config();
const CronJob = require("cron").CronJob;
const USER_COLLECTION = require("../module/user.module");

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
}

module.exports = new eventCron();
