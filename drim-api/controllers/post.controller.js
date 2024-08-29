const POST_COLLECTION = require("../module/post.module");
const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const { isValidId } = require("../config/common");

const json = {};

exports.createPost = _createPost;
exports.getPost = _getPost;
exports.deletePost = _deletePost;

/*
TYPE: Post
TODO: Add new Post
*/

async function _createPost(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    }
    const { title, description, media } = req.body;
    const userId = req.user._id;
    const post = await POST_COLLECTION.create({
      title,
      description,
      media,
      author: userId,
    });
    if (!post) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to create Post",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "post created successfully",
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: post | Method: _createPost | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while creating new post!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: GET
TODO: Get All Post
*/
async function _getPost(req, res) {
  try {
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;

    const posts = await POST_COLLECTION.find().skip(skip).limit(limit);
    if (!posts) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to get Posts",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "post fetched successfully",
      posts,
      total: posts.length,
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: post | Method: _getPost | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while gettting All post!",
      error: e,
    };
    return res.send(json);
  }
}
/*
TYPE: DELETE
TODO: Delete Post
*/
async function _deletePost(req, res) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Id Should be valid or non-empty",
      };
      return res.send(json);
    }

    const posts = await POST_COLLECTION.findByIdAndDelete(id);
    if (!posts) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to delete Posts",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "post deleted successfully",
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: post | Method: _deletePost | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while delering post!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: UPDATE
TODO: Update Post
*/
async function _updatePost(req, res) {
  try {
    const errors = validationResult(req).array();
    if (errors && errors.length > 0) {
      let messArr = errors.map((a) => a.msg);
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Required fields are missing!",
        error: messArr.join(", "),
      };
      return res.send(json);
    }

    const { id } = req.params;
    if (!isValidId(id)) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Id Should be valid or non-empty",
      };
      return res.send(json);
    }
    const updateFields = req.body;
    const updatedPost = await POST_COLLECTION.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to delete Posts",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "post updated successfully",
      data: {
        posts: updatedPost,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error("Controller: post | Method: _updatePost | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while updating post!",
      error: e,
    };
    return res.send(json);
  }
}
