import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR } from "./actionTypes";

const initialState = {
  resetSuccessMsg: null,
  resetError: null,
};

const resetPassword = (state = initialState, action) => {
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
    default:
      return state;
  }
};

export default resetPassword;
