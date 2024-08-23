import { FORGET_PASSWORD, FORGET_PASSWORD_SUCCESS, FORGET_PASSWORD_ERROR, VERIFY_OTP, VERIFY_OTP_SUCCESS, VERIFY_OTP_ERROR } from "./actionTypes";

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

export const verifyOtp = (email, otp, history) => {
  return {
    type: VERIFY_OTP,
    payload: { email, otp, history },
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
