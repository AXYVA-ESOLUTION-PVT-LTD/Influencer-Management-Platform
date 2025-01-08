const { validationResult } = require("express-validator");
const WALLET_COLLECTION = require("../module/wallet.module");
const TRANSACTION_COLLECTION = require("../module/transaction.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
var json = {};

exports.createTransaction = _createTransaction;
exports.getTransactionById = _getTransactionById;
exports.getTransactions = _getTransactions;
exports.updateTransactionDetailById = _updateTransactionDetailById;
exports.removeTransactionById = _removeTransactionById;
exports.removeScreenshotById = _removeScreenshotById;

/*
TYPE: Post
TODO: Create new transaction
*/
async function _createTransaction(req, res) {
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
    } else {
      const { id } = req.decoded;
      let { amount } = req.body;
  
      const existWallet = await WALLET_COLLECTION.findOne({influencerId: id });
      if (!existWallet) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Wallet does not exist for this user!",
          error: "Wallet does not exist for this user!",
        };
        return res.send(json);
      } else if (+amount > existWallet.balance) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "You have not sufficient balance in your wallet to withdraw!",
          error: "You have not sufficient balance in your wallet to withdraw!",
        };
        return res.send(json);
      } else {
        amount = +amount;
        const newTransaction = new TRANSACTION_COLLECTION({
          influencerId: id,
          walletId: existWallet._id,
          amount: +amount.toFixed(2)
        });
        newTransaction.save().then((result) => {
          json.status = CONSTANT.SUCCESS;
          json.result = {
            message: "New transaction created successfully!",
            data: result,
          };
          return res.send(json);
        })
        .catch((error) => {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "An error occurred while create new transaction!",
            error: error,
          };
          return res.send(json);
        });
      }
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _createTransaction | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while create new transaction!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get transaction by id
*/
async function _getTransactionById(req, res) {
  try {
    const id = req.params.id;
    const existTransaction = await TRANSACTION_COLLECTION.findById(id);
    if (!existTransaction) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Transaction does not exists!",
        error: "Transaction does not exists!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = { 
        message: "Transaction found successfully!", 
        data: existTransaction 
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _getTransactionById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get transaction!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all transactions
*/
async function _getTransactions(req, res) {
  try {
    let query={};
    const { id, roleId } = req.decoded;
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;

    if(roleId && roleId.name == "Influencer"){
      var influencerQuery = { influencerId: id };
      query = Object.assign({}, query, influencerQuery);
    }

    var totalRecords = await TRANSACTION_COLLECTION.countDocuments(query);
    var result = await TRANSACTION_COLLECTION.find(query).collation({ locale: "en", strength: 2 }).sort({ updatedAt: "desc" }).skip(skip).limit(limit).populate({
      path: "influencerId",
      model: "User",
      select: ["firstName", "lastName", "username"],
    });
    if (!result) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Transactions not found!",
        error: "Transactions not found!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Transactions found successfully!",
        data: result,
        totalRecords: totalRecords,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _getTransactions | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get transactions!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update transaction detail by id
*/
async function _updateTransactionDetailById(req, res) {
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
    } else {
      const id = req.params.id;
      const { transactionId, status } = req.body;
  
      const existTransaction = await TRANSACTION_COLLECTION.findById(id);
      if (!existTransaction) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Transaction does not exists!",
          error: "Transaction does not exists!",
        };
        return res.send(json);
      } else {
        const existWallet = await WALLET_COLLECTION.findById(existTransaction.walletId);
        if (!existWallet) {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "Wallet does not exist for this user!",
            error: "Wallet does not exist for this user!",
          };
          return res.send(json);
        } else if (existWallet.balance < existTransaction.amount) {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "User have not sufficient balance in wallet to withdraw!",
            error: "User have not sufficient balance in wallet to withdraw!",
          };
          return res.send(json);
        } else {
          const transactionObj = {
            transactionId: transactionId || "",
            status: status
          };
      
          const transaction = await TRANSACTION_COLLECTION.findByIdAndUpdate(id, transactionObj, { new: true});
          if (!transaction) {
            json.status = CONSTANT.FAIL;
            json.result = {
              message: "Fail to update transaction",
            };
            return res.send(json);
          } else {
            existWallet.balance = existWallet.balance - +existTransaction.amount;
            await existWallet.save();

            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "Transaction updated successfully",
              data: {
                transaction,
              },
            };
            return res.send(json);
          }

        }
      }
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _updateTransactionById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while update transaction!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Remove transaction by id
*/
async function _removeTransactionById(req, res) {
  try {
    const id = req.params.id;
    const existTransaction = await TRANSACTION_COLLECTION.findById(id);
    if (!existTransaction) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Transaction does not exists!",
        error: "Transaction does not exists!",
      };
      return res.send(json);
    } else if (existTransaction.status == "Approved") {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Approved transaction does not delete!",
        error: "Approved transaction does not delete!",
      };
      return res.send(json);
    } else {
      TRANSACTION_COLLECTION.findByIdAndDelete(id)
        .then((result) => {
          if (existTransaction && !COMMON.isUndefinedOrNull(existTransaction.screenshot)) {
            let filePath = path.join(__dirname, `../uploads/transaction/${existTransaction.screenshot}`);
            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, async () => {})
            }
          }
          json.status = CONSTANT.SUCCESS;
          json.result = { message: "Transaction deleted successfully!", data: {} };
          return res.send(json);
        })
        .catch((error) => {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "An error occurred while delete transaction!",
            error: error,
          };
          return res.send(json);
        });
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _removeTransactionById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete transaction!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Remove screenshot by id
*/
async function _removeScreenshotById(req, res) {
  try {
    const id = req.params.id;
    const existTransaction = await TRANSACTION_COLLECTION.findById(id);
    if (!existTransaction) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Transaction does not exists!",
        error: "Transaction does not exists!",
      };
      return res.send(json);
    } else {
      const { screenshot } = req.body;
      let filePath = path.join(__dirname, `../uploads/transaction/${screenshot}`);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, async (err) => {
          if (err) {
            json.status = CONSTANT.FAIL;
            json.result = {
              message: "An error occurred while removing transaction screenshot",
              error: err,
            };
            return res.send(json);
          } else {
            var result = await TRANSACTION_COLLECTION.findByIdAndUpdate(id, { screenshot: "" })
            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "Transaction screenshot removed successfully",
              data: {},
            };
            return res.send(json);
          }
        })
      } else {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Transaction screenshot not found",
          error: "Transaction screenshot image not found",
        };
        return res.send(json);
      }
    }
  } catch (e) {
    console.error("Controller: transaction | Method: _removeScreenshotById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while delete transaction!", error: e };
    return res.send(json);
  }
}