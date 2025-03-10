import { call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  getTransactionSuccess,
  getTransactionError,
  getWalletAmountSuccess,
  getWalletAmountError,
  createTransactionSuccess,
  createTransactionError,
  removeTransactionSuccess,
  removeTransactionError,
  updateTransactionSuccess,
  updateTransactionError,
  updateWalletSuccess,
  getWalletSuccess,
  getWalletFail,
  updateWalletFail,
  getPaymentMethodSuccess,
  getPaymentMethodFail,
  getPaymentDetailSuccess,
  getPaymentDetailFail,
  addPaymentDetailSuccess,
  addPaymentDetailFail,
  updatePaymentDetailFail,
  updatePaymentDetailSuccess,
  fetchAllPaymentDetailsSuccess,
  fetchAllPaymentDetailsFail,
  deletePaymentDetailsFail,
  deletePaymentDetailsSuccess,
  fetchAllSecurePaymentDetailsFail,
  fetchAllSecurePaymentDetailsSuccess,
  getTransaction,
} from "./actions";
import {
  GET_TRANSACTION_REQUEST,
  GET_WALLET_AMOUNT_REQUEST,
  CREATE_TRANSACTION_REQUEST,
  REMOVE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_REQUEST,
  GET_WALLET,
  UPDATE_WALLET,
  GET_PAYMENT_METHOD,
  GET_PAYMENT_DETAIL,
  ADD_PAYMENT_DETAIL,
  UPDATE_PAYMENT_DETAIL,
  FETCH_ALL_PAYMENT_DETAILS,
  DELETE_PAYMENT_DETAILS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS,
} from "./actionTypes";
import {
  getTransactionUrl,
  getWalletAmountUrl,
  createTransactionUrl,
  removeTransactionUrl,
  updateTransactionUrl,
  getWalletUrl,
  updateWalletByIdUrl,
  getPaymentMethodUrl,
  getPaymentDetailUrl,
  addPaymentDetailUrl,
  updatePaymentDetailUrl,
  fetchAllPaymentDetailsUrl,
  deletePaymentDetailsUrl,
  fetchAllSecurePaymentDetailsUrl,
} from "../../services/payment";
import STATUS from "../../constants/status";

// Get Transaction data
function* onGetTransaction(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getTransactionUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getTransactionSuccess(response?.result));
    } else {
      throw new Error(response?.result?.message || 'Failed to fetch transaction data');
    }
  } catch (error) {
    yield put(getTransactionError(error.message || 'Failed to fetch transaction data'));
    toast.update({
      render: "Failed to fetch transaction data",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Get Wallet Amount by Influencer ID
function* onGetWalletAmount(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getWalletAmountUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getWalletAmountSuccess(response?.result?.data));
    } else {
      throw new Error(response?.result?.message || 'Failed to fetch wallet amount');
    }
  } catch (error) {
    yield put(getWalletAmountError(error.message || 'Failed to fetch wallet amount'));
    toast.update({
      render: 'Failed to fetch wallet amount',
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Create Transaction
function* onCreateTransaction(action) {
  const toastId = toast.loading("Creating transaction...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(createTransactionUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(createTransactionSuccess(response?.result?.data));
      yield put(
        getTransaction({
          limit: 10,
          pageCount: 0,
        })
      );
      toast.update(toastId, {
        render: "Transaction created successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } else {
      throw new Error(
        response?.result?.message || "Failed to create transaction"
      );
    }
  } catch (error) {
    yield put(
      createTransactionError(error.message || "Failed to create transaction")
    );
    toast.update(toastId, {
      render: error.message || "Failed to create transaction",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onRemoveTransaction(action) {
  const toastId = toast.loading("Removing transaction...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(removeTransactionUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(removeTransactionSuccess(action.payload));
      yield put(
        getTransaction({
          limit: 10,
          pageCount: 0,
        })
      );
      toast.update(toastId, {
        render: "Transaction removed successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } else {
      throw new Error(
        response?.result?.message || "Failed to remove transaction"
      );
    }
  } catch (error) {
    yield put(
      removeTransactionError(error.message || "Failed to remove transaction")
    );
    toast.update(toastId, {
      render: error.message || "Failed to remove transaction",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onUpdateTransaction(action) {
  const toastId = toast.loading("Updating transaction...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateTransactionUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(updateTransactionSuccess(response?.result?.data?.transaction));
      yield put(
        getTransaction({
          limit: 10,
          pageCount: 0,
        })
      );
     
      toast.update(toastId, {
        render: "Transaction updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
    } else {
      throw new Error(
        response?.result?.message || "Failed to update transaction"
      );
    }
  } catch (error) {
    yield put(
      updateTransactionError(error.message || "Failed to update transaction")
    );
    toast.update(toastId, {
      render: error.message || "Failed to update transaction",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

// Fetch All Wallet
function* fetchWallet(action) {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getWalletUrl, token, action.payload);

    if (response?.status === STATUS.SUCCESS) {
      yield put(getWalletSuccess(response.result.data));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch wallet data. Please try again later"
      );
    }
  } catch (error) {
    yield put(
      getWalletFail(
        error.message || "Failed to fetch wallet data. Please try again later"
      )
    );
  }
}

// Update an Wallet
function* onUpdateWallet(action) {
  const id = toast.loading("Updating wallet...");
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(updateWalletByIdUrl, token, action.payload);
    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: response?.result?.message || "wallet updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      yield put(updateWalletSuccess(response?.result?.data?.wallet));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update wallet. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      updateWalletFail(
        error.message || "Failed to update wallet. Please try again later."
      )
    );
    toast.update(id, {
      render: error.message || "Failed to update wallet",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onGetPaymentMethod() {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getPaymentMethodUrl, token);
    if (response?.status === STATUS.SUCCESS) {
      yield put(getPaymentMethodSuccess(response?.result?.data?.paymentMethod));
    } else {
      throw new Error(
        response?.data?.result?.error ||
          "Failed to fetch payment method. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      getPaymentMethodFail(
        error.message ||
          "Failed to fetch payment method. Please try again later."
      )
    );
  }
}

function* onGetPaymentDetail(action) {
  const fieldName = action.payload;
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(getPaymentDetailUrl, token, fieldName);
    if (response?.status === STATUS.SUCCESS) {
      const fieldValue = response?.result?.data[fieldName];
      yield put(getPaymentDetailSuccess(fieldName, fieldValue));
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to fetch payment detail. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      getPaymentDetailFail(error.message || "Failed to fetch payment detail.")
    );
  }
}

function* onAddPaymentDetail(action) {
  const data = action.payload;
  const id = toast.loading("Submitting payment details...");

  try {
    const token = localStorage.getItem("authUser");

    const response = yield call(addPaymentDetailUrl, token, data);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render:
          response?.result?.message || "Payment details added successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      yield put(addPaymentDetailSuccess(response?.result?.message));
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.isBankVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to add payment details. Please try again later."
      );
    }
  } catch (error) {
    yield put(
      addPaymentDetailFail(error.message || "Failed to add payment details.")
    );
    toast.update(id, {
      render: "Failed to add payment details",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onUpdatePaymentDetail(action) {
  const data = action.payload;
  const id = toast.loading("Updating payment details...");

  try {
    const token = localStorage.getItem("authUser");

    const response = yield call(updatePaymentDetailUrl, token, data);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render:
          response?.result?.message || "Payment details updated successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      yield put(updatePaymentDetailSuccess(response?.result?.message));

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.isBankVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      throw new Error(
        response?.result?.error ||
          "Failed to update payment details. Please try again."
      );
    }
  } catch (error) {
    yield put(
      updatePaymentDetailFail(
        error.message || "Failed to update payment details."
      )
    );
    toast.update(id, {
      render: "Failed to update payment details",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onFetchAllPaymentDetails() {
  try {
    const token = localStorage.getItem("authUser");
    const response = yield call(fetchAllPaymentDetailsUrl, token);
    if (response?.status === STATUS.SUCCESS) {
      yield put(fetchAllPaymentDetailsSuccess(response?.result?.data));
    } else {
      throw new Error(
        response?.data?.result?.error || "Failed to fetch payment details."
      );
    }
  } catch (error) {
    yield put(
      fetchAllPaymentDetailsFail(
        error.message || "Failed to fetch payment details."
      )
    );
  }
}

function* onDeletePaymentDetails() {
  const id = toast.loading("Deleting payment details...");
  try {
    const token = localStorage.getItem("authUser");

    const response = yield call(deletePaymentDetailsUrl, token);

    if (response?.status === STATUS.SUCCESS) {
      toast.update(id, {
        render: "Payment details deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: true,
      });

      yield put(
        deletePaymentDetailsSuccess("Payment details deleted successfully.")
      );

      // Update local user state
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.isBankVerified = false;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      throw new Error(
        response?.data?.result?.error || "Failed to delete payment details."
      );
    }
  } catch (error) {
    yield put(
      deletePaymentDetailsFail(
        error.message || "Failed to delete payment details."
      )
    );
    toast.update(id, {
      render: "Failed to delete payment details.",
      type: "error",
      isLoading: false,
      autoClose: true,
    });
  }
}

function* onFetchAllSecurePaymentDetails(action) {
  try {
    const token = localStorage.getItem("authUser");

    const response = yield call(
      fetchAllSecurePaymentDetailsUrl,
      action.payload,
      token
    );

    if (response?.status === STATUS.SUCCESS) {
      yield put(fetchAllSecurePaymentDetailsSuccess(response?.result?.data));
    } else {
      yield put(
        fetchAllSecurePaymentDetailsFail(
          response?.data?.result?.error || "Failed to fetch payment details."
        )
      );
    }
  } catch (error) {
    yield put(
      fetchAllSecurePaymentDetailsFail(
        error.message || "Failed to fetch payment details."
      )
    );
  }
}

function* PaymentSaga() {
  yield takeEvery(GET_TRANSACTION_REQUEST, onGetTransaction);
  yield takeEvery(GET_WALLET_AMOUNT_REQUEST, onGetWalletAmount);
  yield takeEvery(CREATE_TRANSACTION_REQUEST, onCreateTransaction);
  yield takeEvery(REMOVE_TRANSACTION_REQUEST, onRemoveTransaction);
  yield takeEvery(UPDATE_TRANSACTION_REQUEST, onUpdateTransaction);
  yield takeEvery(GET_WALLET, fetchWallet);
  yield takeEvery(UPDATE_WALLET, onUpdateWallet);
  yield takeEvery(GET_PAYMENT_METHOD, onGetPaymentMethod);
  yield takeEvery(GET_PAYMENT_DETAIL, onGetPaymentDetail);
  yield takeEvery(ADD_PAYMENT_DETAIL, onAddPaymentDetail);
  yield takeEvery(UPDATE_PAYMENT_DETAIL, onUpdatePaymentDetail);
  yield takeEvery(FETCH_ALL_PAYMENT_DETAILS, onFetchAllPaymentDetails);
  yield takeEvery(DELETE_PAYMENT_DETAILS, onDeletePaymentDetails);
  yield takeEvery(
    FETCH_ALL_SECURE_PAYMENT_DETAILS,
    onFetchAllSecurePaymentDetails
  );
}

export default PaymentSaga;
