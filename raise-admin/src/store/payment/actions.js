import {
  GET_TRANSACTION_REQUEST,
  GET_TRANSACTION_SUCCESS,
  GET_TRANSACTION_ERROR,
  GET_WALLET_AMOUNT_REQUEST,
  GET_WALLET_AMOUNT_SUCCESS,
  GET_WALLET_AMOUNT_ERROR,
  CREATE_TRANSACTION_REQUEST,
  CREATE_TRANSACTION_SUCCESS,
  CREATE_TRANSACTION_ERROR,
  REMOVE_TRANSACTION_REQUEST,
  REMOVE_TRANSACTION_SUCCESS,
  REMOVE_TRANSACTION_ERROR,
  UPDATE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_SUCCESS,
  UPDATE_TRANSACTION_ERROR,
  GET_WALLET,
  GET_WALLET_FAIL,
  GET_WALLET_SUCCESS,
  UPDATE_WALLET,
  UPDATE_WALLET_FAIL,
  UPDATE_WALLET_SUCCESS, GET_PAYMENT_METHOD,
  GET_PAYMENT_METHOD_SUCCESS,
  GET_PAYMENT_METHOD_FAIL,
  GET_PAYMENT_DETAIL,
  GET_PAYMENT_DETAIL_SUCCESS,
  GET_PAYMENT_DETAIL_FAIL,
  ADD_PAYMENT_DETAIL,
  ADD_PAYMENT_DETAIL_SUCCESS,
  ADD_PAYMENT_DETAIL_FAIL,
  UPDATE_PAYMENT_DETAIL,
  UPDATE_PAYMENT_DETAIL_SUCCESS,
  UPDATE_PAYMENT_DETAIL_FAIL,
  FETCH_ALL_PAYMENT_DETAILS,
  FETCH_ALL_PAYMENT_DETAILS_SUCCESS,
  FETCH_ALL_PAYMENT_DETAILS_FAIL,
  DELETE_PAYMENT_DETAILS_FAIL,
  DELETE_PAYMENT_DETAILS_SUCCESS,
  DELETE_PAYMENT_DETAILS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS_SUCCESS,
  FETCH_ALL_SECURE_PAYMENT_DETAILS_FAIL
} from "./actionTypes";

// Action to request transaction data
export const getTransaction = (params) => {
  return {
    type: GET_TRANSACTION_REQUEST,
    payload: params,
  };
};

// Action on successful transaction data fetch
export const getTransactionSuccess = (data) => {
  return {
    type: GET_TRANSACTION_SUCCESS,
    payload: data,
  };
};

// Action when there is an error fetching transaction data
export const getTransactionError = (error) => {
  return {
    type: GET_TRANSACTION_ERROR,
    payload: error,
  };
};

// Action to request wallet amount by influencer
export const getWalletAmount = (id) => {
  return {
    type: GET_WALLET_AMOUNT_REQUEST,
    payload: { id },
  };
};

// Action on successful wallet amount fetch
export const getWalletAmountSuccess = (data) => {
  return {
    type: GET_WALLET_AMOUNT_SUCCESS,
    payload: data,
  };
};

// Action when there is an error fetching wallet amount
export const getWalletAmountError = (error) => {
  return {
    type: GET_WALLET_AMOUNT_ERROR,
    payload: error,
  };
};

// Action to create a new transaction
export const createTransaction = (data) => {
  return {
    type: CREATE_TRANSACTION_REQUEST,
    payload: data,
  };
};

// Action on successful transaction creation
export const createTransactionSuccess = (data) => {
  return {
    type: CREATE_TRANSACTION_SUCCESS,
    payload: data,
  };
};

// Action when there is an error creating a transaction
export const createTransactionError = (error) => {
  return {
    type: CREATE_TRANSACTION_ERROR,
    payload: error,
  };
};

// Action to remove a transaction by ID
export const removeTransactionById = (id) => {
  return {
    type: REMOVE_TRANSACTION_REQUEST,
    payload: id,
  };
};

// Action on successful transaction removal
export const removeTransactionSuccess = (data) => {
  return {
    type: REMOVE_TRANSACTION_SUCCESS,
    payload: data,
  };
};

// Action when there is an error removing a transaction
export const removeTransactionError = (error) => {
  return {
    type: REMOVE_TRANSACTION_ERROR,
    payload: error,
  };
};

// Action to update transaction
export const updateTransaction = (data) => {
  return {
    type: UPDATE_TRANSACTION_REQUEST,
    payload: data,
  };
};

// Action on successful transaction update
export const updateTransactionSuccess = (data) => {
  return {
    type: UPDATE_TRANSACTION_SUCCESS,
    payload: data,
  };
};

// Action when there is an error updating a transaction
export const updateTransactionError = (error) => {
  return {
    type: UPDATE_TRANSACTION_ERROR,
    payload: error,
  };
};

export const getWallet = (payload) => ({
  type: GET_WALLET,
  payload,
});

export const getWalletSuccess = (obj) => ({
  type: GET_WALLET_SUCCESS,
  payload: obj,
});

export const getWalletFail = (error) => ({
  type: GET_WALLET_FAIL,
  payload: error,
});

// Update Wallets
export const updateWallet = (payload) => ({
  type: UPDATE_WALLET,
  payload,
});

export const updateWalletSuccess = (obj) => ({
  type: UPDATE_WALLET_SUCCESS,
  payload: obj,
});

export const updateWalletFail = (error) => ({
  type: UPDATE_WALLET_FAIL,
  payload: error,
});

export const getPaymentMethod = (paymentMethod) => ({
  type: GET_PAYMENT_METHOD,
  payload : paymentMethod
});

export const getPaymentMethodSuccess = (paymentMethod) => ({
  type: GET_PAYMENT_METHOD_SUCCESS,
  payload: paymentMethod,
});

export const getPaymentMethodFail = (error) => ({
  type: GET_PAYMENT_METHOD_FAIL,
  payload: error,
});

export const getPaymentDetail = (fieldName) => ({
  type: GET_PAYMENT_DETAIL,
  payload: fieldName,
});

export const getPaymentDetailSuccess = (fieldName, fieldValue) => ({
  type: GET_PAYMENT_DETAIL_SUCCESS,
  payload: { fieldName, fieldValue },
});

export const getPaymentDetailFail = (error) => ({
  type: GET_PAYMENT_DETAIL_FAIL,
  payload: error,
});

export const addPaymentDetail = (data) => ({
  type: ADD_PAYMENT_DETAIL,
  payload: data,
});

export const addPaymentDetailSuccess = (message) => ({
  type: ADD_PAYMENT_DETAIL_SUCCESS,
  payload: message,
});

export const addPaymentDetailFail = (error) => ({
  type: ADD_PAYMENT_DETAIL_FAIL,
  payload: error,
});

export const updatePaymentDetail = (data) => ({
  type: UPDATE_PAYMENT_DETAIL,
  payload: data,
});

export const updatePaymentDetailSuccess = (message) => ({
  type: UPDATE_PAYMENT_DETAIL_SUCCESS,
  payload: message,
});

export const updatePaymentDetailFail = (error) => ({
  type: UPDATE_PAYMENT_DETAIL_FAIL,
  payload: error,
});

export const fetchAllPaymentDetails = () => ({
  type: FETCH_ALL_PAYMENT_DETAILS,
});

export const fetchAllPaymentDetailsSuccess = (data) => ({
  type: FETCH_ALL_PAYMENT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAllPaymentDetailsFail = (error) => ({
  type: FETCH_ALL_PAYMENT_DETAILS_FAIL,
  payload: error,
});

export const deletePaymentDetails = () => ({
  type: DELETE_PAYMENT_DETAILS,
});

export const deletePaymentDetailsSuccess = (message) => ({
  type: DELETE_PAYMENT_DETAILS_SUCCESS,
  payload: message,
});

export const deletePaymentDetailsFail = (error) => ({
  type: DELETE_PAYMENT_DETAILS_FAIL,
  payload: error,
});

export const fetchAllSecurePaymentDetails = (paymentType) => ({
  type: FETCH_ALL_SECURE_PAYMENT_DETAILS,
  payload: paymentType, 
});

export const fetchAllSecurePaymentDetailsSuccess = (data) => ({
  type: FETCH_ALL_SECURE_PAYMENT_DETAILS_SUCCESS,
  payload: data,
});

export const fetchAllSecurePaymentDetailsFail = (error) => ({
  type: FETCH_ALL_SECURE_PAYMENT_DETAILS_FAIL,
  payload: error,
});