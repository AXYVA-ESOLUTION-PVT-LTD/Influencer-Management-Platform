import {
  GET_NOTIFICATION,
  GET_NOTIFICATION_FAIL,
  GET_NOTIFICATION_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  notifications: [],
  loading: false,
  error: {},
};

const notification = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [...action.payload.notifications],
        loading: false,
        error: null,
      };
    case GET_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notification;
