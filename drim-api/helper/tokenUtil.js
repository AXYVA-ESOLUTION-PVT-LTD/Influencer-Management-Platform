const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to generate a new access token
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.superSecret, { expiresIn: '1d' });
};

module.exports = { generateAccessToken };
