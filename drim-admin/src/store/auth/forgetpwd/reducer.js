import {
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_ERROR,
} from "./actionTypes";

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  verifyOtpSuccessMsg: null,
  verifyOtpError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    // Forget Password Cases
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

    // Default Case
    default:
      return state;
  }
};

export default forgetPassword;
