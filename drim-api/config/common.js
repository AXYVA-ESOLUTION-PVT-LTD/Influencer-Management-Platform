const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();
const CONSTANT = require("./constant.js");
const ALGO = process.env.ALGO;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = CONSTANT.IV_LENGTH;

exports.decryptPassword = _decryptPassword;
exports.encryptPassword = _encryptPassword;
exports.isOtpValid = _isOtpValid;
exports.sendOTPEmail = _sendOTPEmail;
exports.isValidId = _isValidId;

function _encryptPassword(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let newIV = iv.toString("hex").slice(0, 16);
  let cipher = crypto.createCipheriv(ALGO, Buffer.from(ENCRYPTION_KEY), newIV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function _decryptPassword(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let newIV = iv.toString("hex").slice(0, 16);
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(ENCRYPTION_KEY),
    newIV
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function _isOtpValid(otpTime, time) {
  const currentDate = new Date();
  const otpDate = new Date(otpTime);

  const timeDifference = currentDate - otpDate;

  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference < time;
}

async function _sendOTPEmail(email, otp, mailOptions) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "",
      pass: "",
    },
  });

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent:");
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

function _isValidId(id) {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return false;
  }

  return mongoose.Types.ObjectId.isValid(id);
}
