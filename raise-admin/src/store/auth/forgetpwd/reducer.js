import {
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_ERROR,
  SET_NEW_PASSWORD_SUCCESS,
  SET_NEW_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  verifyOtpSuccessMsg: null,
  verifyOtpError: null,
  setNewPasswordSuccessMsg: null,
  setNewPasswordError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgetSuccessMsg: action.payload,
        forgetError: null,
      };
    case FORGET_PASSWORD_ERROR:
      return {
        ...state,
        forgetSuccessMsg: null,
        forgetError: action.payload,
      };

    // Verify OTP Cases
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        verifyOtpSuccessMsg: action.payload,
        verifyOtpError: null,
      };
    case VERIFY_OTP_ERROR:
      return {
        ...state,
        verifyOtpSuccessMsg: null,
        verifyOtpError: action.payload,
      };
    case SET_NEW_PASSWORD_SUCCESS:
        return {
          ...state,
          setNewPasswordSuccessMsg: action.payload,
          setNewPasswordError: null,
        };
    case SET_NEW_PASSWORD_ERROR:
        return {
          ...state,
          setNewPasswordSuccessMsg: null,
          setNewPasswordError: action.payload,
        };
    // Default Case
    default:
      return state;
  }
};

export default forgetPassword;
