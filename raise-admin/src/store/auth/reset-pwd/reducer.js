import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR, RESET_PASSWORD_NULL } from "./actionTypes";

const initialState = {
  resetSuccessMsg: null,
  resetError: null,
};

const ResetPassword = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetSuccessMsg: action.payload,
        resetError: null,
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        resetSuccessMsg: null,
        resetError: action.payload,
      };
    case RESET_PASSWORD_NULL:
      return {
        ...state,
        resetSuccessMsg: null,
        resetError: null,
      };
    default:
      return state;
  }
};

export default ResetPassword;
