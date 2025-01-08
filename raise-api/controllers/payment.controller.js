const PAYMENT_COLLECTION = require("../module/payment.module.js");
const USER_COLLECTION = require("../module/user.module.js");
const CONSTANT = require("../config/constant.js");
const COMMON = require("../config/common.js");
var json = {};

const _addPayment = async (req, res) => {
  const {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    upiId,
    phoneNumber,
    paymentMethod,
  } = req.body;

  // Initialize response object
  const json = {};
  const { id } = req.decoded;

  // Validate the payment method and ensure data consistency
  if (!paymentMethod || !["Bank", "GPay", "PayPal"].includes(paymentMethod)) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Invalid payment method",
      error: 'The payment method should be one of "Bank", "GPay", or "PayPal".',
    };
    return res.send(json);
  }

  // Validate required fields for each payment method
  if (paymentMethod === "Bank") {
    if (
      !accountHolderName ||
      !accountNumber ||
      !ifscCode ||
      !bankName ||
      !branchName
    ) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Missing required bank details.",
        error: "All bank-related fields are required.",
      };
      return res.send(json);
    }
  } else if (paymentMethod === "GPay") {
    if (!upiId) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Missing required GPay details.",
        error: "UPI ID is required for GPay.",
      };
      return res.send(json);
    }
  } else if (paymentMethod === "PayPal") {
    if (!phoneNumber) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Missing required PayPal details.",
        error: "Phone number is required for PayPal.",
      };
      return res.send(json);
    }
  }

  // Check if user exists
  const user = await USER_COLLECTION.findById(id);
  if (!user) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "User not found",
      error: "The provided user ID does not exist.",
    };
    return res.send(json);
  }

  // Check if payment record already exists for this influencerId
  const existingPayment = await PAYMENT_COLLECTION.findOne({
    influencerId: id,
  });
  if (existingPayment) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Duplicate payment record",
      error: "A payment record for this influencer already exists.",
    };
    return res.send(json);
  }

  // Create the payment object based on the payment method
  const paymentData = {
    influencerId: id, // Set the influencerId from decoded JWT
    paymentType: paymentMethod,
    accountHolderName: paymentMethod === "Bank" ? accountHolderName : "",
    accountNumber: paymentMethod === "Bank" ? accountNumber : "",
    ifscCode: paymentMethod === "Bank" ? ifscCode : "",
    bankName: paymentMethod === "Bank" ? bankName : "",
    branchName: paymentMethod === "Bank" ? branchName : "",
    upiId: paymentMethod === "GPay" ? upiId : "",
    phoneNumber: paymentMethod === "PayPal" ? phoneNumber : "",
  };

  try {
    // Save the payment data to the database
    const newPayment = new PAYMENT_COLLECTION(paymentData);
    const savedPayment = await newPayment.save();
    user.isBankVerified = true;
    await user.save();

    // Respond with success message
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details added successfully!",
      data: savedPayment,
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the saving process
    console.error("Error saving payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to add payment details.",
      error:
        err.message || "An error occurred while saving the payment details.",
    };
    return res.send(json);
  }
};

const _deletePayment = async (req, res) => {
  const json = {};
  const { id } = req.decoded; // Get the influencerId from decoded JWT

  // Check if user exists
  const user = await USER_COLLECTION.findById(id);
  if (!user) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "User not found",
      error: "The provided user ID does not exist.",
    };
    return res.send(json);
  }

  try {
    // Find and delete the payment document based on influencerId
    const deletedPayment = await PAYMENT_COLLECTION.findOneAndDelete({
      influencerId: id, // Influencer ID from decoded JWT
    });
    user.isBankVerified = false;
    await user.save();

    if (!deletedPayment) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Payment details not found for the given influencer.",
        error: "No payment details found for the given influencerId.",
      };
      return res.send(json);
    }


    // Respond with success message
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details deleted successfully!",
      data: deletedPayment,
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the deletion process
    console.error("Error deleting payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to delete payment details.",
      error:
        err.message || "An error occurred while deleting the payment details.",
    };
    return res.send(json);
  }
};

const _updatePayment = async (req, res) => {
  const {
    accountHolderName,
    accountNumber,
    ifscCode,
    bankName,
    branchName,
    upiId,
    phoneNumber,
    paymentMethod,
  } = req.body;

  const json = {};
  const { id } = req.decoded; // Get the influencerId from decoded JWT

  // Validate the payment method and ensure data consistency
  if (!paymentMethod || !["Bank", "GPay", "PayPal"].includes(paymentMethod)) {
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Invalid payment method",
      error: 'The payment method should be one of "Bank", "GPay", or "PayPal".',
    };
    return res.send(json);
  }

  // Prepare the updated payment data based on the payment method
  const updateData = {
    influencerId: id, // Set the influencerId from decoded JWT
    paymentType: paymentMethod,
    accountHolderName: paymentMethod === "Bank" ? accountHolderName : undefined,
    accountNumber: paymentMethod === "Bank" ? accountNumber : undefined,
    ifscCode: paymentMethod === "Bank" ? ifscCode : undefined,
    bankName: paymentMethod === "Bank" ? bankName : undefined,
    branchName: paymentMethod === "Bank" ? branchName : undefined,
    upiId: paymentMethod === "GPay" ? upiId : undefined,
    phoneNumber: paymentMethod === "PayPal" ? phoneNumber : undefined,
  };

  try {
    // Update the payment document based on influencerId and paymentType
    const updatedPayment = await PAYMENT_COLLECTION.findOneAndUpdate(
      { influencerId: id, paymentType: paymentMethod },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message:
          "Payment details not found for the given influencer and payment method.",
        error:
          "No payment details found for the given influencerId and payment method.",
      };
      return res.send(json);
    }

    // Respond with success message
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details updated successfully!",
      data: updatedPayment,
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the update process
    console.error("Error updating payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to update payment details.",
      error:
        err.message || "An error occurred while updating the payment details.",
    };
    return res.send(json);
  }
};

const _getPaymentMethod = async (req, res) => {
  const json = {};
  const { id } = req.decoded; 
  try {
    // Find the payment details based on influencerId
    const paymentDetails = await PAYMENT_COLLECTION.findOne({
      influencerId: id,
    });

    if (!paymentDetails) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "No payment details found for the given influencer.",
        error: "No payment details found for the given influencerId.",
      };
      return res.send(json);
    }

    // Respond with success message and payment method
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details retrieved successfully!",
      data: {
        paymentMethod: paymentDetails.paymentType, // Only return payment method (paymentType)
      },
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the retrieval process
    console.error("Error retrieving payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to retrieve payment details.",
      error:
        err.message ||
        "An error occurred while retrieving the payment details.",
    };
    return res.send(json);
  }
};

const _getPaymentDetails = async (req, res) => {
  const { fields } = req.body;
  const json = {};
  const { id } = req.decoded;

  try {
    // Validate that fields is an array
    if (!Array.isArray(fields) || fields.length === 0) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "Invalid fields provided.",
        error: "Fields must be a non-empty array.",
      };
      return res.send(json);
    }

    // Construct the projection object for MongoDB
    const projection = fields.reduce((acc, field) => {
      acc[field] = 1; // Include only the requested fields
      return acc;
    }, {});

    // Find the payment details based on influencerId and selected fields
    const paymentDetails = await PAYMENT_COLLECTION.findOne(
      { influencerId: id }, // Query
      projection // Projection
    );

    if (!paymentDetails) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "No payment details found for the given influencer.",
        error: "No payment details found for the given influencerId.",
      };
      return res.send(json);
    }

    // Respond with success message and requested payment details
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details retrieved successfully!",
      data: paymentDetails,
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the retrieval process
    console.error("Error retrieving payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to retrieve payment details.",
      error:
        err.message ||
        "An error occurred while retrieving the payment details.",
    };
    return res.send(json);
  }
};

const _getAllPaymentDetails = async (req, res) => {
  const json = {};
  const { id } = req.decoded;

  try {
    // Find the payment details based on influencerId
    const paymentDetails = await PAYMENT_COLLECTION.findOne({
      influencerId: id,
    });

    if (!paymentDetails) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "No payment details found for the given influencer.",
        error: "No payment details found for the given influencerId.",
      };
      return res.send(json);
    }

    // Respond with success message and all payment details
    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: "Payment details retrieved successfully!",
      data: paymentDetails,
    };
    return res.send(json);
  } catch (err) {
    // Handle errors during the retrieval process
    console.error("Error retrieving payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to retrieve payment details.",
      error:
        err.message ||
        "An error occurred while retrieving the payment details.",
    };
    return res.send(json);
  }
};

const _getSecurePaymentDetails = async (req, res) => {
  const json = {};
  const { id } = req.decoded;
  const { paymentType } = req.body; 

  try {
    // Find the payment details based on influencerId
    const paymentDetails = await PAYMENT_COLLECTION.findOne({
      influencerId: id,
    });

    if (!paymentDetails) {
      json.status = CONSTANT.FAIL;
      json.result = {
        message: "No payment details found for the given influencer.",
        error: "No payment details found for the given influencerId.",
      };
      return res.send(json);
    }

    // Response based on paymentType
    let responseData = {};
    switch (paymentType) {
      case "Bank":
        responseData = {
          ifscCode: paymentDetails.ifscCode || "Not Available",
          bankName: paymentDetails.bankName || "Not Available",
          branchName: paymentDetails.branchName || "Not Available",
          accountHolderName: paymentDetails.accountHolderName
            ? paymentDetails.accountHolderName.replace(/.(?=.{4})/g, "*")
            : "Not Available",
          accountNumber: paymentDetails.accountNumber
            ? paymentDetails.accountNumber.slice(0, -4).replace(/\d/g, "*") + paymentDetails.accountNumber.slice(-4)
            : "Not Available",
        };
        break;

      case "GPay":
        responseData = {
          upiId: paymentDetails.upiId
            ? paymentDetails.upiId.replace(/.(?=.{4})/g, "*")
            : "Not Available",
        };
        break;

      case "PayPal":
        responseData = {
          phoneNumber: paymentDetails.phoneNumber
            ? paymentDetails.phoneNumber.slice(0, -4).replace(/\d/g, "*") + paymentDetails.phoneNumber.slice(-4)
            : "Not Available",
        };
        break;

      default:
        json.status = CONSTANT.FAIL;
        json.result = {
          message: "Invalid payment type.",
          error: "The specified payment type is not valid.",
        };
        return res.send(json);
    }

    json.status = CONSTANT.SUCCESS;
    json.result = {
      message: `${paymentType} payment details retrieved successfully!`,
      data: responseData,
    };

    return res.send(json);
  } catch (err) {
    // Handle errors during the retrieval process
    console.error("Error retrieving payment details:", err);
    json.status = CONSTANT.FAIL;
    json.result = {
      message: "Failed to retrieve payment details.",
      error:
        err.message ||
        "An error occurred while retrieving the payment details.",
    };
    return res.send(json);
  }
};



exports.getAllPaymentDetails = _getAllPaymentDetails;
exports.getPaymentDetails = _getPaymentDetails;
exports.getPaymentMethod = _getPaymentMethod;
exports.updatePayment = _updatePayment;
exports.addPayment = _addPayment;
exports.deletePayment = _deletePayment;
exports.getSecurePaymentDetails = _getSecurePaymentDetails;