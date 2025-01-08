const express = require("express");
const { addPublication, getPublicationById, getPublications, removePublicationById, removeScreenshotById, updatePublicationById, updatePublicationStatusById } = require("../controllers/publication.controller");
const auth = require("../config/authentication");
const router = express.Router();
const { uploadSingleImage, validatePublication} = require("../middleware/publication.middleware");

router.post("/addPublication", auth, uploadSingleImage('image'), validatePublication, addPublication);
router.get("/getPublicationById/:id", auth, getPublicationById);
router.post("/getPublications", auth, getPublications);
router.get("/removePublicationById/:id", auth, removePublicationById);
router.post("/removeScreenshotById/:id", auth, removeScreenshotById);
router.post("/updatePublicationById/:id", auth, uploadSingleImage('image'), validatePublication, updatePublicationById);
router.post("/updatePublicationStatusById/:id", auth, updatePublicationStatusById);

module.exports = router;
