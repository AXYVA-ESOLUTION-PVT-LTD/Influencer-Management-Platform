import {
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "./actionTypes";

const initialState = {
  userProfile: {},
  loading: false,
  error: null,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userProfile: {
          ...action.payload.updatedUser,
        },
        error: null,
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default user;
