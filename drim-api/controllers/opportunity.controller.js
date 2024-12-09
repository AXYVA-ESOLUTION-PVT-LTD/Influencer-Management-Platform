const { validationResult } = require("express-validator");
const CONSTANT = require("../config/constant");
const OPPORTUNITY_COLLECTION = require("../module/opportunity.module");
const TICKET_COLLECTION = require("../module/ticket.module");
const COMMON = require("../config/common");
const { getSortOption } = require("../helper/getSortOption");
const path = require("path");
const fs = require("fs");
const json = {};

exports.addOpportunity = _addOpportunity;
exports.getOpportunity = _getOpportunity;
exports.deleteOpportunity = _deleteOpportunity;
exports.updateOpportunity = _updateOpportunity;
exports.uploadOpportunityImage = _uploadOpportunityImage;
exports.removeOpportunityImage = _removeOpportunityImage;

/*
TYPE: Get
TODO: Get all opportunities
*/
async function _getOpportunity(req, res) {
  try {
    const userId = req.decoded.id;
    const userRole = req.decoded.roleId.name;
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;
    let query = { isDeleted: false };
    if(userRole == 'Influencer'){
      const tickets = await TICKET_COLLECTION.find({influencerId: userId }, { opportunityId: 1 });
      if(tickets.length > 0){
        query._id = { $nin: tickets.map(t => t.opportunityId) };
      }
    }
    let sort = {};
    const { id, title, type, sortBy, sortOrder } = req.body;

    if (id) {
      query.id = Number(id);
    }

    if (title) {
      query.title = { $regex: `^${title}`, $options: "i" };
    }

    if (type) {
      query.type = { $regex: `^${type}`, $options: "i" };
    }

    if (sortBy) {
      sort[sortBy] = sortOrder === 1 ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const opportunities = await OPPORTUNITY_COLLECTION.find(query)
      .collation({ locale: "en", caseLevel: true })
      .sort(sort)
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

    const { title, description, type, imageUrl ,location, status ,brand, endDate } =
      req.body;
    const opportunity = await OPPORTUNITY_COLLECTION.create({
      title,
      type,
      description,
      location,
      imageUrl,
      brand,
      endDate,
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

/*
TYPE: Post
TODO: Upload Opportunity Image
*/
async function _uploadOpportunityImage(req, res) {
  try {
    let filePath = path.join(__dirname, '../uploads/opportunityImage');
    COMMON.uploadSingleFile(filePath, req, res, async (err, file) => {
      
      if (err) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while uploading opportunity",
          error: err,
        };
        return res.send(json);
      } else {

        json.status = CONSTANT.SUCCESS;
        json.result = {
          message: "Opportunity image uploaded successfully",
          data: {
            fileName: file.filename, 
          },
        };
        return res.send(json);
      }
    })
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _uploadOpportunityImage | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while uploading opportunity image",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Remove Opportunity Image
*/
async function _removeOpportunityImage(req, res) {
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
    const { fileName } = req.body;
    let filePath = path.join(__dirname, `../uploads/opportunityImage/${fileName}`);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "An error occurred while removing opportunity image",
            error: err,
          };
          return res.send(json);
        } else {
          json.status = CONSTANT.SUCCESS;
          json.result = {
            message: "Opportunity image removed successfully",
            data: {},
          };
          return res.send(json);
        }
      })
    } else {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Opportunity image not found",
        error: "Opportunity image not found",
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _removeOpportunityImage | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while removing opportunity image",
      error: e,
    };
    return res.send(json);
  }
}

async function _importOpportunity(req, res) {
  try {
    var notSavedCount = 0;
    var notSavedArray = [];
    var totalSavedCount = 0;
    var file = req.files.file.path;
    var ext = req.body.ext;
    var count = 0;

    COMMON.excelCSVToJson(file, ext, function (err, results) {
      if (err) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while importing opportunity",
          error: err,
        };
        return res.send(json);
      } else {
        var outputData = results.map(Object.values);
        var columnPositionErrors = checkImportFileFormat(outputData[0]);
        outputData.shift();
        if (columnPositionErrors !== '') {
          json.status = '0';
          json.result = { 'message': columnPositionErrors, 'errorType': "COLUMN_POSITION" };
          res.send(json);
          return;
        }
        if (!outputData || COMMON_ROUTE.isArrayEmpty(outputData)) {
          json.status = '0';
          json.result = { 'message': 'File does not contain more data', 'notSavedCount': notSavedCount, 'notSaved': notSavedArray, 'totalSavedCount': totalSavedCount };
          return res.send(json);
        } else {
          removeDuplicate(outputData, function (data) {
            var results = data;
            results.forEach(element => {
              var propertyObject = {
                name: element[0],
                address1: "",
                address2: "",
                city: "",
                country: element[2],
                landmark: "",
                zip: "",
                rating: "",
                lowRate: "",
                highRate: "",
                resortTypeId: "",
                websiteTemplateUrl: "",
                brochureTemplateUrl: element[1],
                htmlContent: "",
                propertyImages: [],
                propertyAmenities: []
              }
              insertPropertyFromImport(propertyObject, function (err, insertResult) {
                if (err || !insertResult) {
                  notSavedArray.push(propertyObject);
                  notSavedCount++;
                  count++;
                  if (count == results.length) {
                    json.status = '1';
                    json.result = { 'message': totalSavedCount + ' Clients Imported Successfully', 'totalSavedCount': totalSavedCount, 'notSavedCount': notSavedCount, 'notSaved': notSavedArray };
                    return res.send(json);
                  }
                } else {
                  totalSavedCount++;
                  count++;
                  if (count == results.length) {
                    json.status = '1';
                    json.result = { 'message': totalSavedCount + ' Clients Imported Successfully', 'totalSavedCount': totalSavedCount, 'notSavedCount': notSavedCount, 'notSaved': notSavedArray };
                    return res.send(json);
                  }
                }

              })
            });
          });
        }
      }
    })
  } catch (e) {
    console.error(
      "Controller: opportunity | Method: _importOpportunity | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while importing opportunity",
      error: e,
    };
    return res.send(json);
  }
}
