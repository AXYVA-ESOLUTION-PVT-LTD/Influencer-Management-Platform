const { check } = require("express-validator");
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/publication')); // Adjust your upload folder path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const uploadSingleImage = (fieldName) => (req, res, next) => {
  const singleUpload = upload.single(fieldName);

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Image upload failed.', details: err.message });
    }
    next();
  });
};

const validatePublication = [
  check("opportunityId")
    .exists()
    .withMessage("Opportunity id is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Opportunity id cannot be empty!")
    .bail()
    .isMongoId()
    .withMessage("Opportunity id must be a valid MongoDB ObjectId"),
  check("type")
    .exists()
    .withMessage("Type is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Type cannot be empty!"),
  check("publicationLink")
    .exists()
    .withMessage("Publication link is required!")
    .bail()
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Publication link cannot be empty!"),
];

module.exports = { uploadSingleImage, validatePublication };