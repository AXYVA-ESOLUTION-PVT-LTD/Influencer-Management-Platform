const { validationResult } = require("express-validator");
const WALLET_COLLECTION = require("../module/wallet.module");
const USER_COLLECTION = require("../module/user.module");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
var json = {};

exports.createWallet = _createWallet;
exports.getWalletById = _getWalletById;
exports.getWallets = _getWallets;
exports.updateWalletById = _updateWalletById;
exports.removeWalletById = _removeWalletById;
exports.getWalletByInfluencerId = _getWalletByInfluencerId;
/*
TYPE: Post
TODO: Create new wallet
*/
async function _createWallet(req, res) {
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
      const { influencerId, balance } = req.body;

      const existUser = await USER_COLLECTION.findOne({
        _id: influencerId,
        isDeleted: false,
      });
      if (!existUser) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "User does not exist!",
          error: "User does not exist!",
        };
        return res.send(json);
      } else {
        const existWallet = await WALLET_COLLECTION.findOne({
          influencerId: influencerId,
        });
        if (existWallet) {
          json.status = CONSTANT.FAIL;
          json.result = {
            message: "Wallet already exists!",
            error: "Wallet already exists!",
          };
          return res.send(json);
        } else {
          const newWallet = new WALLET_COLLECTION({
            influencerId: influencerId,
            balance: balance,
          });
          newWallet
            .save()
            .then((result) => {
              json.status = CONSTANT.SUCCESS;
              json.result = {
                message: "New wallet created successfully!",
                data: result,
              };
              return res.send(json);
            })
            .catch((error) => {
              json.status = CONSTANT.FAIL;
              json.result = {
                message: "An error occurred while create new wallet!",
                error: error,
              };
              return res.send(json);
            });
        }
      }
    }
  } catch (e) {
    console.error("Controller: wallet | Method: _createWallet | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while create new wallet!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get wallet by id
*/
async function _getWalletById(req, res) {
  try {
    const id = req.params.id;
    const existWallet = await WALLET_COLLECTION.findById(id);
    if (!existWallet) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Wallet does not exists!",
        error: "Wallet does not exists!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Wallet found successfully!",
        data: existWallet,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: wallet | Method: _getWalletById | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get wallet!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Get all wallets
*/
async function _getWallets(req, res) {
  try {
    let query = {};
    const limit = req.body.limit ? req.body.limit : 10;
    const pageCount = req.body.pageCount ? req.body.pageCount : 0;
    const skip = limit * pageCount;

    var totalWallets = await WALLET_COLLECTION.countDocuments(query);

    query = {
      influencerId: { $exists: true, $ne: null }, // Ensure influencerId is valid
    };

    // var wallets = await WALLET_COLLECTION.find(query).collation({ locale: "en", strength: 2 }).sort({ updatedAt: "desc" }).skip(skip).limit(limit).populate({
    //   path: "influencerId",
    //   model: "User",
    //   select: ["username", "platform", "email"],
    // });

    var wallets = await WALLET_COLLECTION.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ updatedAt: "desc" })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "influencerId",
        model: "User",
        select: ["username", "platform", "email"],
      });

    if (!wallets) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Wallets not found!",
        error: "Wallets not found!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Wallets found successfully!",
        data: {
          wallets,
          totalWallets,
        },
      };
      return res.send(json);
    }
  } catch (e) {
    console.error("Controller: wallet | Method: _getWallets | Error: ", e);
    json.status = CONSTANT.FAIL;
    json.result = { message: "An error occurred while get wallets!", error: e };
    return res.send(json);
  }
}

/*
TYPE: Post
TODO: Update wallet by id
*/
async function _updateWalletById(req, res) {
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
    const id = req.params.id;
    const { influencerId, balance, transactionType } = req.body;

    const existUser = await USER_COLLECTION.findOne({
      _id: influencerId,
      isDeleted: false,
    });
    if (!existUser) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "User does not exist!",
        error: "User does not exist!",
      };
      return res.send(json);
    } else {
      const existWallet = await WALLET_COLLECTION.findById(id).populate({
        path: "influencerId",
        model: "User",
        select: ["username", "platform", "email"],
      });
      if (!existWallet) {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Wallet already exists!",
          error: "Wallet already exists!",
        };
        return res.send(json);
      } else {
        let finalBalance = +balance;
        if (transactionType == "deposit") {
          existWallet.balance = existWallet.balance + +finalBalance.toFixed(2);
        }
        if (transactionType == "withdraw") {
          existWallet.balance = existWallet.balance - +finalBalance.toFixed(2);
        }

        existWallet
          .save()
          .then((result) => {
            json.status = CONSTANT.SUCCESS;
            json.result = {
              message: "Wallet updated successfully!",
              data: {
                wallet: result,
              },
            };
            return res.send(json);
          })
          .catch((error) => {
            json.status = CONSTANT.FAIL;
            json.result = {
              message: "An error occurred while update wallet!",
              error: error,
            };
            return res.send(json);
          });
        // WALLET_COLLECTION.findByIdAndUpdate(id, { balance: finalBalance }, { new: true }).then((result) => {
        //   json.status = CONSTANT.SUCCESS;
        //   json.result = {
        //     message: "Wallet updated successfully!",
        //     data: {
        //       wallet: result
        //     },
        //   };
        //   return res.send(json);
        // })
        // .catch((error) => {
        //   json.status = CONSTANT.FAIL;
        //   json.result = {
        //     message: "An error occurred while update wallet!",
        //     error: error,
        //   };
        //   return res.send(json);
        // });
      }
    }
  } catch (e) {
    console.error(
      "Controller: wallet | Method: _updateWalletById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while update wallet!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Remove wallet by id
*/
async function _removeWalletById(req, res) {
  try {
    const id = req.params.id;
    const existWallet = await WALLET_COLLECTION.findById(id);
    if (!existWallet) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Wallet does not exists!",
        error: "Wallet does not exists!",
      };
      return res.send(json);
    }
    WALLET_COLLECTION.findByIdAndDelete(id)
      .then((result) => {
        json.status = CONSTANT.SUCCESS;
        json.result = { message: "Wallet deleted successfully!", data: {} };
        return res.send(json);
      })
      .catch((error) => {
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "An error occurred while delete wallet!",
          error: error,
        };
        return res.send(json);
      });
  } catch (e) {
    console.error(
      "Controller: wallet | Method: _removeWalletById | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while remove wallet!",
      error: e,
    };
    return res.send(json);
  }
}

/*
TYPE: Get
TODO: Get wallet by influencer id
*/
async function _getWalletByInfluencerId(req, res) {
  try {
    const id = req.params.id;
    const query = { influencerId: id };
    const existWallet = await WALLET_COLLECTION.findOne(query);
    if (!existWallet) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Wallet does not exists!",
        error: "Wallet does not exists!",
      };
      return res.send(json);
    } else {
      json.status = CONSTANT.SUCCESS;
      json.result = {
        message: "Wallet found successfully!",
        data: existWallet,
      };
      return res.send(json);
    }
  } catch (e) {
    console.error(
      "Controller: wallet | Method: _getWalletByInfluencerId | Error: ",
      e
    );
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "An error occurred while get wallet by influencer id!",
      error: e,
    };
    return res.send(json);
  }
}
