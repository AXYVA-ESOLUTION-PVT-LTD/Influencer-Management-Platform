const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const OPPORTUNITY_COLLECTION = require("../module/opportunity.module");
const COMMON = require("../config/common");
const { getSortOption } = require("../helper/getSortOption");

const json = {};

exports.addOpportunity = _addOpportunity;
exports.getOpportunity = _getOpportunity;
exports.deleteOpportunity = _deleteOpportunity;
exports.updateOpportunity = _updateOpportunity;

/*
TYPE: Get
TODO: Get all opportunities
*/
async function _getOpportunity(req, res) {
  try {
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;
    let query = { isDeleted: false };
    const { id, title, type, sortBy } = req.body;

    if (id) {
      query.id = Number(id);
    }

    if (title) {
      query.title = { $regex: `^${title}`, $options: "i" };
    }

    if (type) {
      query.type = { $regex: `^${type}`, $options: "i" };
    }

    const opportunities = await OPPORTUNITY_COLLECTION.find(query)
      .sort(getSortOption(sortBy))
      .skip(skip)
      .limit(limit);

    const totalOpportunities = await OPPORTUNITY_COLLECTION.countDocuments(
      query
    );
    if (!opportunities) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to get opportunities",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Opportunity fetched successfully",
      data: {
        opportunities,
        totalOpportunities: totalOpportunities,
        currentPage: pageCount,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _getOpportunity | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while getting All Opportunity",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Add new Opportunity
*/
async function _addOpportunity(req, res) {
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

    const { title, description, type, location, requirements, status } =
      req.body;
    const opportunity = await OPPORTUNITY_COLLECTION.create({
      title,
      description,
      type,
      location,
      requirements,
      status,
    });
    if (!opportunity) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to create Opportunity",
      };
      return res.send(json);
    }
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Opportunity created successfully",
      data: {
        opportunity,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _addOpportunity | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while adding new Opportunity",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Delete
TODO: Delete Opportunity
*/
async function _deleteOpportunity(req, res) {
  try {
    const { id } = req.params;

    if (!COMMON.isValidId(id)) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Id Should be valid or non-empty",
      };
      return res.send(json);
    }
    const opportunity = await OPPORTUNITY_COLLECTION.findById(id);
    if (!opportunity || opportunity.isDeleted) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Opportunity does not exits",
      };
      return res.send(json);
    }

    opportunity.isDeleted = true;
    opportunity
      .save()
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Opportunity deleted successfully",
          data: {
            id: opportunity._id,
          },
        };
        return res.send(json);
      })
      .catch((err) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Fail to delete Opportunity",
        };
        return res.send(json);
      });
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _deleteOpportunity | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while deleting Opportunity",
      error: e,
    };
    return res.send(json);
  }
}
/*
TYPE: Put
TODO: Patch Opportunity
*/
async function _updateOpportunity(req, res) {
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

    if (!COMMON.isValidId(id)) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Id Should be valid or non-empty",
      };
      return res.send(json);
    }

    const updateFields = req.body;

    const updatedOpportunity = await OPPORTUNITY_COLLECTION.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedOpportunity) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Fail to update Opportunity",
      };
      return res.send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Opportunity updated successfully",
      data: {
        opportunity: updatedOpportunity,
      },
    };
    return res.send(json);
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _updateOpportunity | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while Updating Opportunity",
      error: e,
    };
    return res.send(json);
  }
}
