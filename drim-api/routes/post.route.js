const express = require("express");
const Post = require("../controllers/post.controller");
const postMiddleware = require("../middleware/post.middleware");
const { validate } = require("../module/forgotPassword.module");
const auth = require("../config/authentication");
const router = express.Router();

// Create Post
router.post(
  "/",
  postMiddleware.validatePost,
  auth,
  postMiddleware.validatePostRole,
  Post.createPost
);

// Get All Post
router.get("/", auth, postMiddleware.validatePostRole, Post.getPost);

// Delete Post
router.delete("/:id", auth, postMiddleware.validatePostRole, Post.deletePost);

//TODO: Update POST
router.put(
  "/:id",
  postMiddleware.validatePost,
  auth,
  postMiddleware.validatePostRole,
  Post.deletePost
);

module.exports = router;
