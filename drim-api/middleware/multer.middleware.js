const multer = require("multer");
const path = require("path");
const USER_COLLECTION = require("../module/user.module");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: async function (req, file, cb) {
    const user = await USER_COLLECTION.findOne({ email: req.decoded.email });

    cb(null, user._id + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
