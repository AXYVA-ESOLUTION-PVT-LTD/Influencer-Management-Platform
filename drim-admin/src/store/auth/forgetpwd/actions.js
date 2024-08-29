import { FORGET_PASSWORD, FORGET_PASSWORD_SUCCESS, FORGET_PASSWORD_ERROR, VERIFY_OTP, VERIFY_OTP_SUCCESS, VERIFY_OTP_ERROR, SET_NEW_PASSWORD, SET_NEW_PASSWORD_SUCCESS, SET_NEW_PASSWORD_ERROR } from "./actionTypes";

export const userForgetPassword = (user, history) => {
  return {
    type: FORGET_PASSWORD,
    payload: { user, history },
  };
};

export const userForgetPasswordSuccess = message => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const userForgetPasswordError = message => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  };
};

export const verifyOtp = (data ,history) => {
  return {
    type: VERIFY_OTP,
    payload: { data, history },
  };
};

export const verifyOtpSuccess = (message) => {
  return {
    type: VERIFY_OTP_SUCCESS,
    payload: message,
  };
};

export const verifyOtpError = (message) => {
  return {
    type: VERIFY_OTP_ERROR,
    payload: message,
  };
};


export const setNewPassword = (data, history) => {
  return {
    type: SET_NEW_PASSWORD,
    payload: { data, history },
  };
};

export const setNewPasswordSuccess = (message) => {
  return {
    type: SET_NEW_PASSWORD_SUCCESS,
    payload: message,
  };
};

export const setNewPasswordError = (message) => {
  return {
    type: SET_NEW_PASSWORD_ERROR,
    payload: message,
  };
};