import { get, post ,del } from "../../helpers/api_helper";
import {  ADD_PAYMENT_DETAIL_URL, CREAT_TRANSACTION_API_URL, DELETE_PAYMENT_DETAILS_URL, GET_ALL_PAYMENT_DETAILS_URL, GET_ALL_SECURE_PAYMENT_DETAILS_URL, GET_PAYMENT_DETAIL_URL, GET_PAYMENT_METHOD_URL, GET_WALLET_API, GET_WALLET_API_URL, REMOVE_TRANSACTION_API_URL, TRANSACTION_API_URL, UPDATE_PAYMENT_DETAIL_URL, UPDATE_TRANSACTION_API_URL, UPDATE_WALLET_BY_ID_API } from "./routes";

// Get Transactions
export const getTransactionUrl = (token ,params) => {
  return post(`${TRANSACTION_API_URL}`, 
    params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get Wallet Amount by Influencer ID
export const getWalletAmountUrl = (token ,params) => {
  return get(`${GET_WALLET_API_URL}/${params.id}`, 
    params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create a Transaction
export const createTransactionUrl = (token ,params) => {
  return post(`${CREAT_TRANSACTION_API_URL}`, 
    params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Remove a Transaction by ID
export const removeTransactionUrl = (token, id) => {
  return get(`${REMOVE_TRANSACTION_API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update a Transaction by ID
export const updateTransactionUrl = (token, data) => {
  return post(
    `${UPDATE_TRANSACTION_API_URL}/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getWalletUrl = (token, data) => {
  return post(
    GET_WALLET_API,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateWalletByIdUrl = (token, data) => {
  const { id, payload } = data;
  return post(
    `${UPDATE_WALLET_BY_ID_API}/${id}`,
    { ...payload },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getPaymentMethodUrl = (token) => {
  return get(
    `${GET_PAYMENT_METHOD_URL}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getPaymentDetailUrl = (token, fieldName) => {
  return post(
    GET_PAYMENT_DETAIL_URL,
    { fields: [fieldName] },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const addPaymentDetailUrl = (token, data) => {
  return post(ADD_PAYMENT_DETAIL_URL,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updatePaymentDetailUrl = (token, data) => {
  return post(
    UPDATE_PAYMENT_DETAIL_URL,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const fetchAllPaymentDetailsUrl = (token) => {
  return get(
    GET_ALL_PAYMENT_DETAILS_URL,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deletePaymentDetailsUrl = (token) => {
  return del(
    DELETE_PAYMENT_DETAILS_URL,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};


export const fetchAllSecurePaymentDetailsUrl = (paymentType, token) => {
  return post(GET_ALL_SECURE_PAYMENT_DETAILS_URL,
    { paymentType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};