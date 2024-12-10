const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();
const CONSTANT = require("./constant.js");
const ALGO = process.env.ALGO;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = CONSTANT.IV_LENGTH;
const multer = require('multer');

exports.decryptPassword = _decryptPassword;
exports.encryptPassword = _encryptPassword;
exports.isOtpValid = _isOtpValid;
exports.sendEmail = _sendEmail;
exports.isValidId = _isValidId;
exports.generatePassword = _generatePassword;
exports.uploadSingleFile = _uploadSingleFile;
exports.excelCSVToJson = _excelCSVToJson;
exports.isUndefinedOrNull = _isUndefinedOrNull;

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

async function _sendEmail(mailOptions) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

function _generatePassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$";

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";

  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function _uploadSingleFile(filePath, req, res, callback) {
	const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filePath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
      const originalName = file.originalname;
      const fileExtension = originalName.split('.').pop();
      const newFilename = `${uniqueSuffix}.${fileExtension}`;
      cb(null, newFilename);
    }
  })

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb('Only JPEG, PNG, and JPG files are allowed!', false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');

  upload(req, res, (err, i) => {
    if (err) {
      callback(err, []);
    } else {
      callback(null,req.file);
    }
  });
}

function _excelCSVToJson(file, ext, callback) {
	try {
	var xlsx2json = require('xlsx2json');

	if (validEXCELExts.indexOf(ext) >= 0) {
		xlsx2json(file).then(jsonArray => {
			callback(null, jsonArray[0]);
		});

	} else if (validCSVExts.indexOf(ext) >= 0) {
		var csvjson = require('csvjson');

		var data = fs.readFileSync(file, { encoding: 'utf8' });
		var options = {
			delimiter: ',', // optional
			quote: '"' // optional
		};

		var output = csvjson.toArray(data, options);
		callback(null, output);
	} else {
		callback('Type missing', []);
	}
	} catch (e) {
		console.error("Controller: common | Method: _excelCSVToJson | Error: ", e);
		callback(e, []);
	}
}

function _isUndefinedOrNull(value) {
	return (typeof value == 'undefined' || value == null || value == "")
}