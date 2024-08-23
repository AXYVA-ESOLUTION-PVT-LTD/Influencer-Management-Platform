import { RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR } from "./actionTypes";

// Action to trigger the reset password process
export const userResetPassword = (user, history) => {
  return {
    type: RESET_PASSWORD,
    payload: { user, history },
  };
};

// Action for successful reset password
export const userResetPasswordSuccess = (message) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: message,
  };
};

// Action for reset password error
export const userResetPasswordError = (message) => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: message,
  };
};
